#include <iostream>
#include <emscripten/bind.h>

static void hello()
{
    std::cout << "Hello World" << std::endl;
}

EMSCRIPTEN_BINDINGS(hello) {
    emscripten::function("hello", &hello);
};
