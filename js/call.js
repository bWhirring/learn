Function.prototype.call = function(ctx) {
  ctx = Object(ctx) || window;
  ctx.fn = this;
  const args = [];
  const len = arguments.length;

  for (let i = 1; i < len; i++) {
    args.push("arguments[" + i + "]");
  }

  const res = eval("ctx.fn(" + args + ")");
  delete ctx.fn;
  return res;
};

// ES6

Function.prototype.call = function(ctx, ...args) {
  ctx = Object(ctx) || window;
  const fn = Symbol("fn");
  ctx[fn] = this;
  const result = ctx[fn](...args);
  delete ctx[fn];

  return result;
};
