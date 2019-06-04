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

> process.nextTick() 属于 idle 观察者， setImmediate() 属于 check 观察者。在每一个轮询检查中，idel 观察者先于 I/O 观察者，I/O 观察者先于 check 观察者, 在具体表现上，process.nextTick()的回调函数保存在一个数组中，setImmediate() 的结果则是保存在链表中。在行为中，process.nextTick()在每轮循环中会将数组中的回调函数全部执行完，而 setImmdiate() 在每轮循环中执行链表中的一个回调函数
