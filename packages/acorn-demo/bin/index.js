"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var acorn_1 = require("acorn");
var defaultOptions = {
    ecmaVersion: 9,
    sourceType: "module",
    ranges: true,
};
var code = "const test = () => console.log(1)";
var ast = acorn_1.Parser.parse(code, defaultOptions);
var token = acorn_1.Parser.tokenizer(code, defaultOptions);
console.log(ast);
console.log(token);
//# sourceMappingURL=index.js.map