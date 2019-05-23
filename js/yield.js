function *foo() {
  var x = yield 42;
  console.log( x );
}

var it = foo();

console.log(it.next());

// *foo 类似
/** function foo() {
  function nextStep(v) {
    switch (state) {
      case 0:
        state++;
        return 42;
      case 1:
        state++;
        x = v;  // yield 表达式完成
        console.log(x);

        // 隐式 return
        return undefined
      default:
        break;
    }
  }
  let state = 0, x;

  return {
    next: function(v) {
      const value = nextStep(v);
      return {
        value,
        done:state === 2
      }
    }
  }
} **/