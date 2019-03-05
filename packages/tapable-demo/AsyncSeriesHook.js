const { AsyncSeriesHook } = require("tapable");

const test = new AsyncSeriesHook(["name"]);
console.time("time");
test.tapAsync("TestPlugin", function(name, cb) {
  setTimeout(() => {
    console.log(name, "TestPlugin");
    cb();
  }, 1000);
});
test.tapAsync("TestPlugin1", function(name, cb) {
  setTimeout(() => {
    console.log(name, "TestPlugin1");
    cb();
  }, 2000);
});
test.tapAsync("TestPlugin3", function(name, cb) {
  setTimeout(() => {
    console.log(name, "TestPlugin3");
    cb();
  }, 3000);
});

test.callAsync("webpack", err => {
  console.log("end");
  console.timeEnd("time");
});
