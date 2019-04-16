### React 16 特性

#### 支持返回数组和字符串

```
return [
  <li>test</li>,
  [
    <li>test</li>
  ],
  <li>test1</li>,
  <li>test2</li>,
];
```

> [示例代码](https://codesandbox.io/s/v0vpn4wn3l)

#### Error Boundary

```
class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }
  componentDidCatch(error, info) {
    this.setState({ hasError: error, info });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Error AGAIN: {this.state.hasError.toString()}</h1>
          {this.state.info &&
            this.state.info.componentStack.split("\n").map(i => {
              return <div key={i}>{i}</div>;
            })}
        </div>
      );
    }
    return this.props.children
  }
}

class App extends React.Component  {
  state = {
    throw: false
  }
  render() {
    if (this.state.throw) {
      throw new Error("YOLO");
    }
    return (
       <button onClick={() => this.setState({ throw: true })}>12</button>
    )
  }
}

ReactDOM.render(
  <ErrorBoundary><App /></ErrorBoundary>,
  document.getElementById("root")
)
```

> [示例代码](https://codesandbox.io/s/qvnqrjy9v4)

#### createPortal

`createPortal` 的出现为弹窗、对话框等脱离文档流的组件开发提供了便利，替换了之前不稳定的 API `unstable_renderSubtreeIntoContainer`，使用`createPortal`可以快速创建`Dialog` 组件，且不需要牵涉到`componentDidMount`、`componentDidUpdate`等生命周期函数。
并且提供`createPortal`渲染的 DOM，事件可以从 protal 的入口段冒泡上来，如果入口端存在`onDialogClick`事件，`createPortal` 中的 DOM 也能够被调用到。

```
class Dialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.node = document.createElement("div");
    document.body.appendChild(this.node);
  }
  render() {
    return [
      <div>huhu</div>,
      createPortal(<div className="dialog">121</div>, this.node)
    ];
  }
}
```

> [示例代码](https://codesandbox.io/s/kkj03jx5or)

#### 支持自定义的 DOM 属性

以前的 React 版本 DOM 不识别除了 HTML 和 SVG 支持的以外属性，在 React 16 版本中将会把全部的属性传递给 DOM 元素。

#### Fiber

Fiber 是对 React 核心算法的一次重新实现，将原本的同步更新过程碎片化，避免主线程的长时间阻塞，使应用的渲染更加流畅。

在 React16 之前，更新组件时会调用各个组件的生命周期函数，计算和比对 Virtual DOM，更新 DOM 树等，这整个过程是同步进行的，中途无法中断。当组件比较庞大，更新操作耗时较长时，就会导致浏览器唯一的主线程都是执行组件更新操作，而无法响应用户的输入或动画的渲染，很影响用户体验。

Fiber 利用分片的思想，把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，在每个小片执行完之后，就把控制权交还给 React 负责任务协调的模块，如果有紧急任务就去优先处理，如果没有就继续更新，这样就给其他任务一个执行的机会，唯一的线程就不会一直被独占。

因此，在组件更新时有可能一个更新任务还没有完成，就被另一个更高优先级的更新过程打断，优先级高的更新任务会优先处理完，而低优先级更新任务所做的工作则会完全作废，然后等待机会重头再来。所以 React Fiber 把一个更新过程分为两个阶段：

第一个阶段 Reconciliation Phase，Fiber 会找出需要更新的 DOM，这个阶段是可以被打断的；
第二个阶段 Commit Phase，是无法别打断，完成 DOM 的更新并展示；
在使用 Fiber 后，需要要检查与第一阶段相关的生命周期函数，避免逻辑的多次或重复调用：

componentWillMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate
与第二阶段相关的生命周期函数：

componentDidMount
componentDidUpdate
componentWillUnmount

#### Fragment

类似返回数组

```
return (
  <Fragment>
    huhu
    <h1>Hello</h1>
  </Fragment>
);
```

> [示例代码](https://codesandbox.io/s/kk5rml7o7)

#### createContext

```
// Index.js
export const Context = createContext();

class Parent extends React.PureComponent {
  render() {
    return (
      <Context.Provider value={"huhu1"}>
        <Child />
      </Context.Provider>
    );
  }
}

// child.js
import { Context } from "./index";

export default class Child extends React.PureComponent {
  render() {
    return (
      <Context.Consumer>{name => <button>{name}</button>}</Context.Consumer>
    );
  }
}
```

> [示例代码](https://codesandbox.io/s/8l9zzv7900)

#### createRef / forwardRef

```
// before
class App extends React.PureComponent {
  click = () => {
    console.log(this.refs.huhu);
  };
  render() {
    return (
      <button ref="huhu" onClick={this.click}>
        btn
      </button>
    );
  }
}

// React 16+

React16 规范了Ref的获取方式，通过`React.createRef` 取得Ref对象


class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  click = () => {
    console.log(this.myRef);
  };
  render() {
    return (
      <button ref={this.myRef} onClick={this.click}>
        btn
      </button>
    );
  }
}

```

`React.forwardRef` 是 Ref 的转发，它能够让父组件访问到子组件的 Ref，从而操作子组件的 DOM。`React.forwardRef`接收一个函数，函数参数有`props`和`ref`

> [示例代码](https://codesandbox.io/s/py57zrykv7)

#### 新的生命周期

`getDerevedStateFromProps(nextProps, prevState)` 其作用是根据传递的`props`更新`state`。特点是无副作用

`getSnapshotBeforeUpdate(prevProps,prevState)`会在组件更新之前获取一个`snapshot`,并可以将计算得的值或从 DOM 得到的信息传递到`componentDidUpdate(nextProps,prevState,snapshot)`，常用于 scroll 位置定位等场景。

`componentDidCatch(error, info)`让开发者自主处理错误信息

#### lazy/Suspense

> [示例代码](https://codesandbox.io/s/oxr624jnyq)

#### Hooks

```
function App() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button type="primary" size="small" onClick={() => setOpen(true)}>
        open
      </Button>
      <Modal
        title="hooks"
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        huhu
      </Modal>
    </div>
  );
}

```

> [示例代码](https://codesandbox.io/s/vq8njvwq5l)

## 参考

[精读《React16 新特性》](https://zhuanlan.zhihu.com/p/52016989)
