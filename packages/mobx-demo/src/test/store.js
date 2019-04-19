import { observable, action, computed } from "mobx";

function timeout(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, num);
  });
}

class AppState {
  @observable count = 1;
  @observable price = 0;
  @observable amount = 1;

  constructor(price) {
    this.price = price;
  }

  @computed get total() {
    return this.price * this.amount;
  }

  @action
  add = async () => {
    await timeout(2000);
    ++this.count;
  };

  @action
  minus = async () => {
    await timeout(2000);
    --this.count;
  };
}

export default AppState;
