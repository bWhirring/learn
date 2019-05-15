// class Test {
//   constructor(name) {
//     this.name = name
//   }
//   static test() {
//     console.log("static function");
//   }

//   huhu() {
//     console.log("huhu");
//   }
// }

// const test = new Test();

// class

function _instance(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instance(instance, Constructor)) {
    throw new TypeError("cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (let i = 0; i < props.length; i++) {
    const descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configuable = true;
    if ("value" in descriptor) descriptor.writable = true;

    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
}

var Test = (function() {
  function Test(name) {
    _classCallCheck(this, Test);

    this.name = name;
  }

  _createClass(
    Test,
    [
      {
        key: "huhu",
        value: function huhu() {
          console.log("huhu");
        }
      }
    ],
    [
      {
        key: "test",
        value: function test() {
          console.log("static function");
        }
      }
    ]
  );

  return Test;
})();

const test = new Test();
test.huhu();
Test.test();
