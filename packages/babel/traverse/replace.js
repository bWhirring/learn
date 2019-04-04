const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

const test = `<div>
  <div className="dwd-name">
  	dwd-haha
  </div>
  <div className="dwd-name">
    dwd-haha
  </div>
</div>`;

const ast = parser.parse(test, {
  sourceType: "module",
  plugins: ["jsx"]
});

const Visitor = {
  // JSXAttribute(path) {
  //   path.node.value.value = "huhu";
  // },
  StringLiteral(path) {
    if (path.node.value === "huhu") return;
    path.replaceWith(t.stringLiteral("huhu"));
  }
};

traverse(ast, Visitor);

const { code } = generate(ast);
console.log(code);
