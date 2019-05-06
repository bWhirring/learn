Function.prototype.call = function(ctx) {
  ctx = ctx || window;
  ctx.fn = this;
  const args = [];

  for (let i = 0; i < arguments.length; i++) {
    args.push("arguments[" + i + "]");
  }

  eval("ctx.fn(" + args + ")");
  delete ctx.fn;
};
