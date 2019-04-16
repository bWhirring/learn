const { HookMap, SyncHook } = require("tapable");

const keyedHook = new HookMap(key => new SyncHook(["arg"]));
keyedHook.tap("some-key", "MyPlugin", arg => {
  console.log(111, arg);
});

const hook = keyedHook.get("some-key");
if (hook !== undefined) {
  hook.call("arg", err => {
    /* ... */
  });
}
