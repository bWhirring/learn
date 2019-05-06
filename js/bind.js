Function.prototype.bind = function(ctx) {
  const self = this,
    slice = Array.prototype.slice,
    args = slice.call(arguments, 1);

  return function() {
    return self.apply(ctx, args.concat(slice.call(arguments, 1)));
  };
};
