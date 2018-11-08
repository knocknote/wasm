FROM trzeci/emscripten:sdk-tag-1.38.8-64bit
MAINTAINER Knocknote<tech@knocknote.co.jp>

RUN apt-get -qq -y update && apt-get install -y --no-install-recommends \
    build-essential \
    openjdk-8-jre \
    golang-1.7

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH

RUN /usr/lib/go-1.7/bin/go get golang.org/dl/go1.11
RUN go1.11 download

RUN git clone --recursive https://github.com/WebAssembly/wabt /src/wabt
RUN mkdir -p /src/wabt/build && cd /src/wabt/build && cmake ../ && make && make install

RUN mkdir -p /go/src/wasm-builder
ADD ./wasm-builder.go /go/src/wasm-builder
RUN go1.11 install wasm-builder

RUN mkdir -p /src/emscripten
ADD ./pre.js /src/emscripten
