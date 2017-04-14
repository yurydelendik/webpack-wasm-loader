# Example wasm-loader.js

Experimental loader that require top-level await.

See https://github.com/yurydelendik/webpack/tree/toplevelawait

## View example

Open 'index.html' in a browser (using a web server).

## Build out/

```
$(WEBPACK_WITH_TOPLEVEL_PATCH)/bin/webpack.js
```

## Build .wasm file

wasm-as example/test.wast -o example.test.wasm
