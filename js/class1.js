// class Test {
//   constructor(name) {
//     this.name = name;
//   }
//   getName() {
//     return this.name;
//   }
// }

let Test = (function() {
  'use strict';
  const Test = function(name) {
    if (typeof new.target === 'undefined') {
      throw new Error(`cannot call a class as a function`);
    }
    this.name = name;
  };

  Object.defineProperty(Test.prototype, 'getName', {
    value: function() {
      if (typeof new.target !== 'undefined') {
        throw new Error(`Method cannot be called with new`);
      }
      return this.name;
    },
    configurable: true,
    enumerable: false,
    writable: true
  });

  return Test;
})();
