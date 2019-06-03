#### setImmediate vs process.nextTick

```nodejs
process.nextTick(() => {
  console.log('延迟执行');
});

setImmediate(() => {
  console.log('延迟执行2');
});

console.log('done');
```

执行结果为 done 延迟执行 延迟执行 2

> process.nextTick() 属于 idle 观察者， setImmediate() 属于 check 观察者。在每一个轮询检查中，idel 观察者先于 I/O 观察者，I/O 观察者先于 check 观察者
