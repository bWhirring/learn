import React from "react";
import { Provider, inject, observer } from "mobx-react";
import Store from "./store";

const store = new Store();

@inject("store")
@observer
class Huhu extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { store } = this.props;
    return (
      <div>
        <button onClick={store.add}>add</button>
        <button onClick={store.minus}>minus</button>
        <span>{store.count}</span>
      </div>
    );
  }
}

export default class Test extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Huhu />
      </Provider>
    );
  }
}
