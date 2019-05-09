#### js 继承

##### 原型链继承

```
function Person() {
  this.name = ["huhu"];
}

Person.prototype.getName = function() {
  console.log(this.name);
};

function Child() {}

Child.prototype = new Person();

const child = new Child();

```

> 缺点: 1。引用类型的属性被所有实例共享。2. 在创建 Child 的实例时，不能向 Person 传参

##### 借用构造函数(经典继承)

```
function Person(name) {
  this.name = name;
}

function Child(name) {
  Person.call(this, name);
}

Child.prototype = new Person();

const child = new Child("huhu");
```

> 优点: 1. 避免了引用类型的属性被所有实例共享 2. 可以在 Child 向 Person 传参 缺点: 方法都在构造函数里面，每次创建实例都会创建一遍方法

##### 组合继承

```
function Person(name) {
  this.name = name;
}

function Child(name, age) {
  Person.call(this, name);
  this.age = age;
}

Child.prototype = new Person();
Child.prototype.constructor = Child;

const child = new Child('kevin', '18');
```

> 优点: 融合原型链继承和构造函数的优点

##### 原型式继承

```
function create(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

> Object.create()的模拟实现 缺点: 包含引用类型的属性值始终都会共享相应的值，这跟原型链继承一样

##### 寄生式继承

```
function create(o) {
  const clone = Object.create(o);
  clone.hello = () => console.log("Hello");
  return clone;
}

```

> 缺点: 跟借用构造函数模式一样，每次创建对象都会创建一遍方法

##### 寄生组合式继承

```
function create(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  let prototype = create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

prototype(child, parent);
```

> 这种方法的高效率提现它只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变
