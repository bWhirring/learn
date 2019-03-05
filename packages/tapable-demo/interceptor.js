const { SyncHook } = require("tapable");

const test = new SyncHook(["name"]);

test.intercept({
  context: true,
  tap: (context, source) => {
    // `context` starts as an empty object if at least one plugin uses `context: true`.
    // If no plugins use `context: true`, then `context` is undefined.
    if (context) {
      // Arbitrary properties can be added to `context`, which plugins can then access.
      context.hasMuffler = true;
    }
    console.log(context, "context");
  },
  call: source => {
    console.log(source, "source");
  },

  register: tapInfo => {
    // tapInfo = { type: "promise", name: "GoogleMapsPlugin", fn: ... }
    console.log(`${tapInfo.name} is register`);
    return tapInfo;
  }
});

test.tap(
  {
    name: "TestPlugin",
    context: true
  },
  (context, newContext) => {
    console.log(context, newContext);
    if (context && context.hasMuffler) {
      console.log("Silence...");
    } else {
      console.log("done!");
    }
  }
);

test.call("world");
