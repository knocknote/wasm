# HOW TO WORK Example

## 1. Run Container by docker-compose

```
# pwd => /path/to/wasm/example
docker-compose up -d
docker ps

CONTAINER ID        IMAGE                          COMMAND                  CREATED             STATUS              PORTS                      NAMES
a854e422c351        example_hello_wasm             "tail -f /dev/null"      18 minutes ago      Up 18 minutes                                  hello_wasm
```

## 2. Build hello.cc simply

```
docker exec -it hello_wasm bash
root@a854e422c351:/src# cd /example
root@a854e422c351:/example# em++ -Oz -std=c++11 \
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
root@a854e422c351:/src# cd /example
root@a854e422c351:/example# wasm-builder --name hello -- \
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
