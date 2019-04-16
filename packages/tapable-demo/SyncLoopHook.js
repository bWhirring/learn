const { SyncLoopHook } = require("tapable");

const test = new SyncLoopHook(["name"]);

let idx = 0;
test.tap("TestPlugin", name => {
  if (idx >= 2) {
    return;
  }
  idx++;
  console.log(name);
  return true;
});

test.call("Hello");
