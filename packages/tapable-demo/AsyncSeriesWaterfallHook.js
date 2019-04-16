const { AsyncSeriesWaterfallHook } = require("tapable");

const test = new AsyncSeriesWaterfallHook(["name"]);

test.tap("TestPlugin", name => {
  console.log(name, "TestPlugin");
  return `Hello ${name}`;
});

test.tap("TestPlugin1", name => {
  console.log(name);
  throw new Error("hahha");
});

test.callAsync("Hello", err => {
  console.log("done");
});
