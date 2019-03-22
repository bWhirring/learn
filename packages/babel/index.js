const babel = require("@babel/core");

const test = babel.transformFileSync("./index.js", {
  // ast: true
});
console.log(test);
