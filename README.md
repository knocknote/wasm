# wasm
Supports building and loading optimized WebAssembly ( powered by emscripten toolchain )

# Motivation

## 1. Supports our WebAssembly application as much as possible of all browsers

We would like to use WebAssembly in our web application.  
But, not every browser supports WebAssembly. 
So, we must use it together with **not** WebAssembly module ( like `asm.js` ).  

Currently, some languages supports WebAssembly ( `Go`, `Rust`, `C`/`C++`, ... ).  
Go and Rust are famous and popular language. Also, they aggressively support WebAssembly. But, they not provide fallback plan from WebAssembly.  
Therefore, we cannot select them.  

On the other hand, `Emscripten` can compile `C`/`C++` to WebAssembly and pure javascript with `asm.js`. So we select it for WebAssembly because in this fact is very attractive for us.

## 2. Compactly use WebAssembly

We know WebAssembly's binary size and memory usage is too large. But, we want to use it compactly.

# Supports building optimized WebAssembly

We provide `Dockerfile` and docker image (by DockerHub) for building WebAssembly.  
Image includes `wasm-builder` and it supports building optimized WebAssembly.  
If you doesn't use `wasm-builder`, compiled WebAssembly use **16MB** memory at least. But, if you compile with `wasm-builder`, it use only **64KB** !!!

# Supports loading WebAssembly with fallback plan

We provide `wasm-loader.js` for loading WebAssembly.  
`wasm-loader.js` provides `WasmLoader` class and it provides `load` method only.  
`load` method call dynamic import statement for loading wasm module.  
First, `load` method try to call dynamic import callback for **`wasm`** module. But if your browser doesn't support to `WebAssembly` , `load` to call dynamic import callback for **`asm.js`** module.

## Install

```
npm install --save @knocknote/wasm-loader
```

# Example

See https://github.com/knocknote/wasm/blob/master/example/README.md

# LICENSE

MIT