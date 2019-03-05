const { AsyncParallelBailHook } = require("tapable");

const test = new AsyncParallelBailHook(["name"]);

test.tap("TestPlugin", name => {
  console.log(name, "TestPlugin");
  return name;
});

test.tap("TestPlugin1", name => {
  console.log(name, "TestPlugin1");
});

test.callAsync("Hello", () => {
  console.log("done");
});
