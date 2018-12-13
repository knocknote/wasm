FROM trzeci/emscripten:sdk-tag-1.38.8-64bit
LABEL maintainer "Knocknote<tech@knocknote.co.jp>"

RUN apt-get -qq -y update && apt-get install -y --no-install-recommends \
    build-essential \
    openjdk-8-jre && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN wget https://dl.google.com/go/go1.11.linux-amd64.tar.gz && tar -xvf go1.11.linux-amd64.tar.gz && mv go /usr/local && rm go1.11.linux-amd64.tar.gz
ENV GOROOT /usr/local/go
ENV GOPATH /go
ENV PATH $GOPATH/bin:$GOROOT/bin:$PATH

RUN git clone --recursive https://github.com/WebAssembly/wabt /src/wabt
RUN mkdir -p /src/wabt/build

WORKDIR /src/wabt/build
RUN cmake ../ && make && make install

RUN mkdir -p /go/src/wasm-builder
COPY ./wasm-builder.go /go/src/wasm-builder
RUN go install wasm-builder

RUN mkdir -p /src/emscripten
COPY ./pre.js /src/emscripten

WORKDIR /src/emscripten

RUN rm -rf /src/wabt
