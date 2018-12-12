.PHONY: wasm

wasm:
	wasm-builder --name hello -- \
		em++ -Oz -std=c++11 \
		--closure 1 \
		--memory-init-file 0 \
		-fno-exceptions \
		--llvm-lto 1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s MODULARIZE=1 \
		-s NO_FILESYSTEM=1 \
		--pre-js /src/emscripten/pre.js \
		--bind \
		hello.cc -o hello.js

.PHONY: asmjs

asmjs:
	em++ -Oz -std=c++11 \
	--closure 1 \
	--memory-init-file 0 \
	-fno-exceptions \
	--llvm-lto 1 \
	-s MODULARIZE=1 \
	-s NO_FILESYSTEM=1 \
	-s WASM=0 \
	--bind \
	hello.cc -o hello.js
