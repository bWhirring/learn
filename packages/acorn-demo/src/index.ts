import { Parser } from "acorn"

const code = `const test = () => console.log(1)`;

const ast = Parser.parse(code, {
  sourceType: "module"
});

console.log(ast);