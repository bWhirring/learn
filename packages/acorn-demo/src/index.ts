import { Parser, Options } from "acorn"

const defaultOptions: Options = {
  ecmaVersion: 9,   // ECMAScript version to parse,
  sourceType: "module", // the mode the code should be parsed in., the influences global strice mode and parsing of `import` and `export` declarations
  ranges: true,
}

const code = `const test = () => console.log(1)`;

const ast = Parser.parse(code, defaultOptions);

const token = Parser.tokenizer(code, defaultOptions);

console.log(ast);

console.log(token);
