# HOW TO WORK Example

## 1. Run Container by docker-compose

```
# pwd => /path/to/wasm/example
docker-compose up -d
docker ps

CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS                      NAMES
40585001c1c2        example_hello_wasm             "tail -f /dev/null"      1 minutes ago      Up 1 minutes                                  hello_wasm
```

## 2. Build hello.cc simply

```
docker exec -it hello_wasm bash
root@40585001c1c2:/src/emscripten/example# em++ -Oz -std=c++11 \
     --closure 1 \
     --memory-init-file 0 \
     -fno-exceptions \
     --llvm-lto 1 \
     -s ALLOW_MEMORY_GROWTH=1 \
     -s MODULARIZE=1 \
     -s NO_FILESYSTEM=1 \
     --bind \
     hello.cc -o hello.js
```

output `hello.js` and `hello.wasm`

Copy these files into your application.   
And load by `<script src="hello.js"/>` . Also, can invoke `hello()` at the following code 

```javascript
var module = new Module();
// waiting for loading of wasm file
module.hello(); // Hello World
```

This example works successfuly, **BUT** memory usage is **16MB** !!  
Also, not waiting for loading of wasm file ( This is emscripten's problem ) 

## 3. Build hello.cc with wasm-builder

```
docker exec -it hello_wasm bash
root@40585001c1c2:/src/emscripten/example# wasm-builder --name hello -- \
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
```

`wasm-builder` can optimize memory usage and support utility for loading wasm file.   
**This command must use with `--pre-js /src/emscripten/pre.js` .**

output `hello-wasm.js` and `hello.wasm`

Copy these files into your application.  
And load by `<script src="hello-wasm.js"/>`.  Also, invoke `hello()` at the following code.

```javascript
Module().asm.then(function(module) { module.hello(); });
```

This example works successfuly, also memory usage is **64KB** !! Congratulations !!

## 4. Use wasm-loader.js

### 4.1 Install dependencies

( current working directory is /path/to/wasm/example )

```
$ npm install
```

or 

```
yarn install
```

### 4.2 Start Server

```
yarn server
```

the above command executes `webpack-dev-server --host 0.0.0.0 --progress --port 5000`

### 4.3 Access Browser ( http://localhost:5000 )

`webpack-dev-server` serve `index.html` .

index.html
```html
<html>
  <head>
    <script src="module_loader.js"></script>
  </head>
  <body></body>
</html>
```

`module_loader.js` is the following.

```javascript
import WasmLoader from '../dist/wasm-loader';

const loader = new WasmLoader();
loader.load(
  () => import('./hello-wasm'),
  () => import('./hello')
).then(module => {
  console.log('loaded module', module);
  module.hello();
});
```

This example use `wasm-loader.js` .  
`wasm-loader.js` provides `WasmLoader` class and it provides `load` method only.  
`load` method call dynamic import statement for loading wasm module.  
First, `load` method try to call dynamic import callback for **`wasm`** module. But if your browser doesn't support to `WebAssembly` , `load` to call dynamic import callback for **`asm.js`** module.
