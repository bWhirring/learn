const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

const source = "Math.add(1,2)";
const ast = parser.parse(source);

// Math.add(1,2) => htaM.dda(1, 2);

traverse(ast, {
  Identifier(path) {
    const { name } = path.node;
    path.node.name = name
      .split("")
      .reverse()
      .join("");
  }
});

//add(1,2) => Math.add(1,2)

// traverse(ast, {
//   CallExpression(path) {
//     if (path.node.callee.name !== "add") return;
//     path.replaceWith(
//       t.callExpression(
//         t.memberExpression(t.identifier("Math"), t.identifier("add")),
//         path.node.arguments
//       )
//     );
//   }
// });

// Math.add(1,2) => add(1,2)

// traverse(ast, {
//   CallExpression(path) {
//     if (path.node.callee.name === "add") return;
//     path.replaceWith(
//       t.callExpression(t.identifier("add"), path.node.arguments)
//     );
//   }
// });

const { code } = generator(ast);
console.log(code);
