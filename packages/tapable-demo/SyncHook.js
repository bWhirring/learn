const { SyncHook } = require("tapable");

const test = new SyncHook(["name"]);

test.tap("TestPlugin", name => {
  console.log(`Hello ${name}`);
});

test.call("world");
