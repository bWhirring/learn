import React from "react";
import "@babel/polyfill";
import ReactDOM from "react-dom";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";
import Test from "./test/index";

class AppState {
  @observable count = 1;

  @action.bound
  add() {
    ++this.count;
  }

  @action.bound
  minus() {
    --this.count;
  }
}

@observer
class App extends React.Component {
  render() {
    const { appState } = this.props;
    console.log(this.props, 1);
    return (
      <React.Fragment>
        <button onClick={appState.add}>add</button>
        <button onClick={appState.minus}>minus</button>
        <span>{appState.count}</span>
        <Test />
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <div>
    <App appState={new AppState(1212)} />
    <DevTools />
  </div>,
  document.getElementById("root")
);
