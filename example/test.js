var r = require('./test.wasm');
exports.test = function () {
  return "Answer: " + r.answer();
};