const {
  transform,
  transformSync,
  transformAsync,
  transformFile,
  transformFileSync,
  transformFileAsync,
  transformFromAst,
  transformFromAstSync,
  transformFromAstAsync,
  parse,
  loadOptions
} = require("@babel/core");

const code = "code";

transform(code, (err, res) => {
  console.log("transform");
});

transformSync(code);
console.log("transformSync");
/**
 * return a promise
 */
transformAsync(code, {
  ast: true,
  sourceMaps: "inline"
}).then(r => {
  console.log("transformAsync");
});

/**
 * Asynchronously transform the entire contents of a file
 */
transformFile("./index.js", (err, res) => {
  console.log("transformFile");
});

/**
 * Synchronous version of babel.transformFile
 */
transformFileSync("./index.js");
console.log("transformFileSync");

/**
 * return a promise
 */
transformFileAsync("./index.js").then(r => {
  console.log("transformFileAsync");
});

const ast = parse(code);

/**
 * transform AST
 */
transformFromAst(ast, code, (err, res) => {
  console.log("transformFromAst");
});

/**
 * synchronous
 */
transformFromAstSync(ast, code);

/**
 * Asynchronous
 */
transformFromAstAsync(ast, code).then(r => {
  console.log("transformFromAstAsync");
});

/**
 * Resolve bable options fully
 */
const options = loadOptions({
  envName: "dev",
  babelrc: true
});
console.log(options);
