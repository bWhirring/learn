Function.prototype.apply = function(ctx, arr) {
  ctx = Object(ctx) || window;
  ctx.fn = this;

  var result;
  if (!arr) {
    result = ctx.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("ctx.fn(" + args + ")");
  }

  delete ctx.fn;
  return result;
};

// ES6
Function.prototype.apply = function(ctx, arr) {
  ctx = Object(ctx) || window;
  const fn = Symbol("fn");
  ctx[fn] = this;
  const result = ctx[fn](...arr);
  delete ctx[fn];

  return result;
};
