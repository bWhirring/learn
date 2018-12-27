class Promise {
  constructor(executor) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = data => {
      if (this.status === "pending") {
        this.value = data;
        this.status = "resolved";
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.status === "pending") {
        this.reason = reason;
        this.status = "rejected";
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      // 如果从onFulfilled中返回的x 就是promise2 就会导致循环引用报错
      return reject(new TypeError("循环引用"));
    }

    let called = false; // 避免多次调用
    // 如果x是一个promise对象 （该判断和下面 判断是不是thenable对象重复 所以可有可无）
    if (x instanceof Promise) {
      // 获得它的终值 继续resolve
      if (x.status === PENDING) {
        // 如果为等待态需等待直至 x 被执行或拒绝 并解析y值
        x.then(
          y => {
            resolvePromise(promise2, y, resolve, reject);
          },
          reason => {
            reject(reason);
          }
        );
      } else {
        // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
        x.then(resolve, reject);
      }
      // 如果 x 为对象或者函数
    } else if (
      x != null &&
      (typeof x === "object" || typeof x === "function")
    ) {
      try {
        // 是否是thenable对象（具有then方法的对象/函数）
        let then = x.then;
        if (typeof then === "function") {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            },
            reason => {
              if (called) return;
              called = true;
              reject(reason);
            }
          );
        } else {
          // 说明是一个普通对象/函数
          resolve(x);
        }
      } catch (e) {
        if (called) return;
        called = true;
        reject(e);
      }
    } else {
      resolve(x);
    }
  }

  then(onFulFilled, onRejected) {
    onFulFilled = typeof onFulFilled === "function" ? onFulFilled : y => y;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    let promise2;
    if (this.status === "resolved") {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          //“宏任务（macro-task）”机制实现
          try {
            let x = onFulFilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    if (this.status === "rejected") {
      promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          //“宏任务（macro-task）”机制实现
          try {
            let x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
    }
    if (this.status === "pending") {
      promise2 = new Promise((resolve, reject) => {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulFilled(this.value);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        // 存放失败的回调
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              this.resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      });
    }
    return promise2; // 调用then后返回一个新的promise
  }
  // catch接收的参数 只用错误
  catch(onRejected) {
    // catch就是then的没有成功的简写
    return this.then(null, onRejected);
  }
}
