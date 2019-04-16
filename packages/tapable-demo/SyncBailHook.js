// 只要监听函数中有一个函数的返回值不为 undefined，则跳过剩下所有的逻辑

const { SyncBailHook } = require("tapable");

const test = new SyncBailHook(["name"]);

// test.tap("TestPlugin", name => {
//   console.log(`Hello ${name}`);
// });

test.tap("Test1Plugin", name => {
  return name;
});

test.tap("Test2Plugin", name => {
  console.log(name);
});

test.call("World");
