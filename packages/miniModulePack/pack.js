(function(modules){
      function require(id) {
        const [ fn, mapping ] = modules[id];

        function requireModule(name) {
            return require(mapping[name]);
        }

        const module = { exports: {} };

        fn(requireModule, module, module.exports );

        return module.exports;
    }
    require(0)
    })({0: [
        function (require, module, exports) { "use strict";

var _test = _interopRequireDefault(require("./test.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var test = function test() {
  return console.log(_test.default);
};

test(); },
        {"./test.js":1},
      ],1: [
        function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _test = require("./test1.js");

var _default = _test.name;
exports.default = _default; },
        {"./test1.js":2},
      ],2: [
        function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = void 0;
var name = "huhu";
exports.name = name; },
        {},
      ],})