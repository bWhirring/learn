import * as babelParser from "@babel/parser";

const test = babelParser.parse("const a = 12");
console.log(test);
