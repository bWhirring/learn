"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var acorn_1 = require("acorn");
var code = "const test = () => console.log(1)";
var ast = acorn_1.Parser.parse(code, {
    sourceType: "module"
});
console.log(ast);
//# sourceMappingURL=index.js.map