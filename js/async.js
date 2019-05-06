// async 函数原理，就是将generator函数和自动执行器，包装在一个函数里

function async(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (e) {
        return reject(e);
      }

      if (next.done) {
        return resolve(next.value);
      }

      Promise.resolve(next.value).then(
        v => {
          step(() => gen.next(v));
        },
        e => {
          return gen.throw(e);
        }
      );
    }
    step(() => gen.next(undefined));
  });
}
