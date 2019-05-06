/**
 * new 原理
 * 1. 创建一个空对象，作为要返回的对象实例
 * 2。将这个对象的原型，指向构造函数的prototype属性
 * 3. 将这个空对象赋值给函数内部的this关键字
 * 4. 开始执行构造函数内部的代码
 */

function newF(obj) {
  const o = {},
    args = [].slice.call(arguments);

  o.__proto__ = obj.prototype;
  const res = obj.apply(o, args.splice(1));
  return typeof res === "object" ? res : o;
}

function Base(name) {
  this.name = name;
}

const name = newF(Base, 1);
console.log(name);
