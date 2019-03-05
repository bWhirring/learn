const { SyncWaterfallHook } = require("tapable");

const test = new SyncWaterfallHook(["name"]);

test.tap("TestPlugin", name => {
  return name;
});

test.tap("TestPlugin1", name => {
  return `Hello ${name}`;
});

test.tap("TestPlugin2", name => {
  console.log(name);
});

test.call("world");
