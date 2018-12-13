package main

import (
	"bufio"
	"bytes"
	"compress/gzip"
	"crypto/md5"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"text/template"
)

var (
	fileName   = flag.String("name", "module", "output filename. if '--name=output' specified, generated output-wasm.js and output.wasm")
	compressed = flag.Bool("compressed", false, "use gzip compress for wasm file")
	src        = flag.String("src", ".", "generate src directory")
	dst        = flag.String("dst", ".", "generate target directory")
)

func validateOption() error {
	if fileName == nil {
		flag.PrintDefaults()
		return errors.New("required --name option")
	}
	return nil
}

type wasmBuilder struct {
	fileName   string
	src        string
	dst        string
	cwd        string
	compressed bool
}

func newWasmBuilder(fileName, src, dst string, compressed bool) (*wasmBuilder, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	return &wasmBuilder{
		fileName:   fileName,
		src:        src,
		dst:        dst,
		cwd:        cwd,
		compressed: compressed,
	}, nil
}

func (b *wasmBuilder) command(args ...string) *exec.Cmd {
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Dir = b.cwd
	return cmd
}

func (b *wasmBuilder) runBuildCommand(args []string) error {
	log.Println("- run build command")
	if len(args) == 0 {
		return errors.New("required build command")
	}
	cmd := b.command(args...)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	cmd.Start()

	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		log.Println(scanner.Text())
	}

	cmd.Wait()
	return nil
}

func (b *wasmBuilder) wasmFilePath() string {
	return filepath.Join(b.cwd, b.src, b.fileName+".wasm")
}

func (b *wasmBuilder) wastFilePath() string {
	return filepath.Join(b.cwd, b.src, b.fileName+".wast")
}

func (b *wasmBuilder) runWasm2Wat() error {
	log.Println("- run wasm2wat")
	return b.command("wasm2wat", b.wasmFilePath(), "-o", b.wastFilePath()).Run()
}

func (b *wasmBuilder) runWat2Wasm() error {
	log.Println("- run wat2wasm")
	return b.command("wat2wasm", b.wastFilePath(), "-o", b.wasmFilePath()).Run()
}

func (b *wasmBuilder) replaceWasmInitialPageNumber() error {
	log.Println("- replace wasm initial page number")
	return b.command(
		"sed",
		"-i",
		"-e",
		`s/(import "env" "memory" (memory (;0;) 256))/(import "env" "memory" (memory (;0;) 1))/`,
		b.wastFilePath(),
	).Run()
}

func (b *wasmBuilder) wasmVersion() (string, error) {
	wasmFilePath := filepath.Join(b.cwd, b.src, b.fileName+".wasm")
	bytes, err := ioutil.ReadFile(wasmFilePath)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", md5.Sum(bytes)), nil
}

func (b *wasmBuilder) compressWasmFile() error {
	if !b.compressed {
		return nil
	}

	log.Println("- compress wasm")
	file, err := ioutil.ReadFile(b.wasmFilePath())
	if err != nil {
		return err
	}
	var buf bytes.Buffer
	zw := gzip.NewWriter(&buf)
	defer zw.Close()
	if _, err := zw.Write(file); err != nil {
		return err
	}
	if err := zw.Flush(); err != nil {
		return err
	}

	return ioutil.WriteFile(b.wasmFilePath(), buf.Bytes(), 0644)
}

func (b *wasmBuilder) putWasmFileToDstDirectory() error {
	log.Println("- move wasm file to dst directory")
	dstWasmPath := filepath.Join(b.cwd, b.dst, b.fileName+".wasm")
	return os.Rename(b.wasmFilePath(), dstWasmPath)
}

func (b *wasmBuilder) putWasmHelperFileToDstDirectory() error {
	log.Println("- output js file to dst directory")
	jsPath := filepath.Join(b.cwd, b.src, b.fileName+".js")
	jsContent, err := ioutil.ReadFile(jsPath)
	if err != nil {
		return err
	}
	tmpl, err := template.New("").Parse(string(jsContent))
	if err != nil {
		return err
	}
	version, err := b.wasmVersion()
	if err != nil {
		return err
	}
	param := struct {
		Version string
		Name    string
	}{
		Version: version,
		Name:    *fileName,
	}
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, &param); err != nil {
		return err
	}

	dstJsPath := filepath.Join(b.cwd, b.dst, b.fileName+"-wasm.js")
	return ioutil.WriteFile(dstJsPath, buf.Bytes(), 0644)
}

func (b *wasmBuilder) run(args []string) error {
	if err := b.runBuildCommand(args); err != nil {
		return err
	}
	if err := b.runWasm2Wat(); err != nil {
		return err
	}
	if err := b.replaceWasmInitialPageNumber(); err != nil {
		return err
	}
	if err := b.runWat2Wasm(); err != nil {
		return err
	}
	if err := b.compressWasmFile(); err != nil {
		return err
	}
	if err := b.putWasmFileToDstDirectory(); err != nil {
		return err
	}
	if err := b.putWasmHelperFileToDstDirectory(); err != nil {
		return err
	}
	return nil
}

func _main(args []string) error {
	if err := validateOption(); err != nil {
		return err
	}
	builder, err := newWasmBuilder(*fileName, *src, *dst, *compressed)
	if err != nil {
		return err
	}
	return builder.run(args)
}

func main() {
	flag.Parse()
	if err := _main(flag.Args()); err != nil {
		log.Printf("error: %+v\n", err)
		os.Exit(1)
	}
	os.Exit(0)
}
