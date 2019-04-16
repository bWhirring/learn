const { parse, parseExpression } = require("@babel/parser");
const code = `
  const name = "huhu";
  import { parse } from "@babel/parser";
`;

/**
 * Parse the provided code as an entire ECMAScript program.
 */
parse(code, {
  sourceType: "module"
});

/**
 * Parse the provided code as a single expression.
 */
parseExpression(`huhu`);
