Object.create =
  Object.create ||
  function(obj) {
    const F = function() {};
    F.prototype = obj;
    return new F();
  };
