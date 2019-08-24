const isArray = o => Object.prototype.toString.call(o) === `[object Array]`;
const isObject = o => Object.prototype.toString.call(o) === `[object Object]`;

const set = (target, key, value, receiver) => {
  console.log('检测到了set的key为 -> ' + key);
  return Reflect.set(target, key, value, receiver);
};

class Observe {
  constructor(target, handle) {
    if (!isArray(target) && !isObject(target)) {
      throw new Error(`target must be array or object`);
    }

    this._target = JSON.parse(JSON.stringify(target));
    this._handle = handle;

    return new Proxy(this._observe(this._target), this._handle);
  }
  _observe(target) {
    for (let i in target) {
      if (isObject(target[i]) || isArray(target[i])) {
        this._observe(target[i]);
        target[i] = new Proxy(target[i], this._handle);
      }
    }
    return target;
  }
}

const o = {
  a: [1, 2],
  c: {
    a: 1,
    b: 2,
    c: [
      [
        1,
        2,
        {
          d: 3
        }
      ]
    ]
  },
  b: 2
};

const ob = new Observe(o, { set });
ob.a.push(3); // 检测到了set的key为 -> 2 检测到了set的key为 -> length
ob.c.a = 2; // 检测到了set的key为 -> a
ob.c.c[0][2].d = 6; // 检测到了set的key为 -> d
ob.b = 44; // 检测到了set的key为 -> b
