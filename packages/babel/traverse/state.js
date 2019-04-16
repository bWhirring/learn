const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

const test = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(test);

// let paramName;

// const Visitor = {
//   FunctionDeclaration(path) {
//     const param = path.node.params[0];
//     paramName = param.name;
//     param.name = "x";
//   },
//   Identifier(path) {
//     if (path.node.name === paramName) {
//       path.node.name = "x";
//     }
//   }
// };

const Visitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = "x";
    path.traverse(
      {
        Identifier(path) {
          if (path.node.name === this.paramName) {
            path.node.name = "x";
          }
        }
      },
      { paramName }
    );
  }
};

traverse(ast, Visitor);

const { code } = generate(ast);
console.log(code);
