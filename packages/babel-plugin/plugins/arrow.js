export default function (babel) {
  const { types } = babel;

  return {
    name: "arrow-function-transform", // not required
    visitor: {
      ArrowFunctionExpression(path){
        let node = path.node;
        let expression = node.body;
        let params = node.params;
        let returnStatement = types.returnStatement(expression);
        let block = types.blockStatement([
            returnStatement
        ]);
        let func = types.functionExpression(null,params, block,false, false);
        path.replaceWith(func);
      }
    }
  };
}
