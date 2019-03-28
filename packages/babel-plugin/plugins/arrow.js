const t = require("@babel/types");

// module.exports = babel => {
//   const { types } = babel;
//   return {
//     name: "arrow-function-transform", // not required
//     visitor: {
//       ArrowFunctionExpression(path) {
//         let node = path.node;
//         let expression = node.body;
//         let params = node.params;
//         let returnStatement = types.returnStatement(expression);
//         let block = types.blockStatement([returnStatement]);
//         let func = types.functionExpression(null, params, block, false, false);
//         path.replaceWith(func);
//       }
//     }
//   };
// };

module.exports = babel => {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const { node } = path;
        const { body, params } = node;
        path.replaceWith(
          t.functionExpression(
            null,
            params,
            t.blockStatement([t.returnStatement(body)]),
            false,
            false
          )
        );
      }
    }
  };
};
