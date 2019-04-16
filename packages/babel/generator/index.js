const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;

const test = "class Example {}";
const ast = parse(test);

const output = generate(ast, {
  /* options */
  sourceMaps: true
});

console.log(output);

const a = "var a = 1;";
const b = "var b = 2;";
const astA = parse(a, { sourceFilename: "a.js" });
const astB = parse(b, { sourceFilename: "b.js" });
const ast1 = {
  type: "Program",
  body: [].concat(astA.program.body, astB.program.body)
};

const { code, map } = generate(ast1, { sourceMaps: true });

console.log(code, map);
