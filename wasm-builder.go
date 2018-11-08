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
	src        = flag.String("src", ".", "")
	dst        = flag.String("dst", ".", "generate target directory name")
)

func validateOption() error {
	if fileName == nil {
		flag.PrintDefaults()
		return errors.New("required --name option")
	}
	if src == nil {
		flag.PrintDefaults()
		return errors.New("required --src option")
	}
	if dst == nil {
		flag.PrintDefaults()
		return errors.New("required --dst option")
	}
	return nil
}

func runBuildCommand(cwd string, args []string) error {
	cmd := exec.Command(args[0], args[1:]...)
	cmd.Dir = cwd
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

func wasmFilePath(cwd string) string {
	return filepath.Join(cwd, *src, *fileName+".wasm")
}

func wastFilePath(cwd string) string {
	return filepath.Join(cwd, *src, *fileName+".wast")
}

func runWasm2Wat(cwd string) error {
	cmd := exec.Command("wasm2wat", wasmFilePath(cwd), "-o", wastFilePath(cwd))
	cmd.Dir = cwd
	return cmd.Run()
}

func replaceWasmInitialPageNumber(cwd string) error {
	cmd := exec.Command(
		"sed",
		"-i",
		"-e",
		`s/(import "env" "memory" (memory (;0;) 256))/(import "env" "memory" (memory (;0;) 1))/`,
		wastFilePath(cwd),
	)
	cmd.Dir = cwd
	return cmd.Run()
}

func runWat2Wasm(cwd string) error {
	cmd := exec.Command("wat2wasm", wastFilePath(cwd), "-o", wasmFilePath(cwd))
	cmd.Dir = cwd
	return cmd.Run()
}

func createWasmVersion(cwd string) (string, error) {
	wasmFilePath := filepath.Join(cwd, *src, *fileName+".wasm")
	bytes, err := ioutil.ReadFile(wasmFilePath)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", md5.Sum(bytes)), nil
}

func compressWasmFile(cwd string) error {
	file, err := ioutil.ReadFile(wasmFilePath(cwd))
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

	return ioutil.WriteFile(wasmFilePath(cwd), buf.Bytes(), 0644)
}

func _main(args []string) error {
	if err := validateOption(); err != nil {
		return err
	}
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}
	log.Println("- run build command")
	if err := runBuildCommand(cwd, args); err != nil {
		return err
	}
	log.Println("- get wasm version")
	version, err := createWasmVersion(cwd)
	if err != nil {
		return err
	}
	log.Println("- run wasm2wat")
	if err := runWasm2Wat(cwd); err != nil {
		return err
	}
	log.Println("- replace wasm initial page number")
	if err := replaceWasmInitialPageNumber(cwd); err != nil {
		return err
	}
	log.Println("- run wat2wasm")
	if err := runWat2Wasm(cwd); err != nil {
		return err
	}

	if *compressed {
		log.Println("- compress wasm")
		if err := compressWasmFile(cwd); err != nil {
			return err
		}
	}

	dstWasmPath := filepath.Join(cwd, *dst, *fileName+".wasm")
	log.Println("- move wasm file to dst directory")
	if err := os.Rename(wasmFilePath(cwd), dstWasmPath); err != nil {
		return err
	}

	jsPath := filepath.Join(cwd, *src, *fileName+".js")
	jsContent, err := ioutil.ReadFile(jsPath)
	if err != nil {
		return err
	}
	tmpl, err := template.New("").Parse(string(jsContent))
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

	log.Println("- output js file to dst directory")
	dstJsPath := filepath.Join(cwd, *dst, *fileName+"-wasm.js")
	if err := ioutil.WriteFile(dstJsPath, buf.Bytes(), 0644); err != nil {
		return err
	}
	return nil
}

func main() {
	flag.Parse()
	if err := _main(flag.Args()); err != nil {
		log.Printf("%+v\n", err)
		os.Exit(1)
	}
	os.Exit(0)
}
