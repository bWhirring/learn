/**
 * instanceof 原理
 * 1. 首先检查右边的是不是构造函数，若是就进入下一步
 * 2. 若左边的原型链上有某个__proto__和右边的构造函数的prototype属性相等的，返回true，否则返回false
 * @param {*} left
 * @param {*} right
 */
function instanceofF(left, right) {
  if (typeof right !== "function") throw "right must be a function";
  let leftProto = left.__proto__,
    rightProto = right.prototype;

  while (true) {
    if (left === null) return false;
    if (leftProto === rightProto) return true;

    leftProto = leftProto.__proto__;
  }
}

function Base() {}

const test = new Base();

const res = instanceofF(test, Base);
console.log(res);
