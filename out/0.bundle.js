webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var r = __webpack_require__(3);
exports.test = function () {
  return "Answer: " + r.answer();
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

exports.elapsed = function () {
  return 7.5e+9;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var wasmPath = __webpack_require__.p + "1847884dc422a24e3fc4a584edf04027.wasm";
var imports = {"time": __webpack_require__(2)};
exports.answer = undefined;
exports.__await = fetch(wasmPath).
 then(res => res.arrayBuffer()).
 then(arr => WebAssembly.instantiate(arr, imports)).
 then(({instance}) => {
    exports['answer'] = instance.exports['answer'];
 });

/***/ })
],void 0,[3]);