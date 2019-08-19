
### commonJS 模块的循环加载

> CommonJS模块的重要特性是加载时运行，即脚本代码在`require`的时候，就会全部执行，一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。

```
node main.js
```

改示例代码证明了两件事。一是，在`b.js`之中，`a.js`没有执行完毕，只执行了第一行。二是，`main.js`执行到第二行时，不会再次执行`b.js`，而是输出缓存的`b.js`的执行结果。

> 总之，CommonJS输入的是被输出值的拷贝，不是引用。