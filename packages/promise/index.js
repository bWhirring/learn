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
            resolvePromise(promise2, x, resolve, reject);
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
            resolvePromise(promise2, x, resolve, reject);
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
              resolvePromise(promise2, x, resolve, reject);
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
              resolvePromise(promise2, x, resolve, reject);
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
