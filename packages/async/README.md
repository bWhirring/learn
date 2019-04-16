### async 原理

`async` 原理就是将 `generator` 函数和自动执行器，包装在一个函数里

```
// async 函数的原理，就是将Genarator函数和自动执行器，包装在一个函数里

function spawn(genF) {
    return new Promise((resolve, reject) => {
        const gen = genF();

        function step(nextF) {
            let next;
            try  {
                next = nextF();
            } catch(e) {
                return reject(e);
            }
            if(next.done) {
                return resolve(next.value);
            }
            Promise.resolve(next.value).then((v) => {
                step(() => gen.next(v))
            }, (e) => {
               return gen.throw(e)
            })
        }

        step(() => gen.next(undefined))

    })
}
```
