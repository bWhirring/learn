const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const test = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(test);

const Visitor = {
  Identifier(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
}

traverse(ast, Visitor);

const { code } = generate(ast);
console.log(code);
