/** @jsx DiyReact.createElement */

const DiyReact = importFromBelow();

const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [
  { name: "DiyReact介绍", url: "http://google.com", likes: randomLikes() },
  { name: "Rendering DOM elements ", url: "http://google.com", likes: randomLikes() },
  { name: "Element creation and JSX", url: "http://google.com", likes: randomLikes() },
  { name: "Instances and reconciliation", url: "http://google.com", likes: randomLikes() },
  { name: "Components and state", url: "http://google.com", likes: randomLikes() }
];

class App extends DiyReact.Component {
  render() {
    return "Hello"
  }

  componentWillMount() {
    console.log('execute componentWillMount');
  }

  componentDidMount() {
    console.log('execute componentDidMount');
  }

  componentWillUnmount() {
    console.log('execute componentWillUnmount');
  }
}

class Story extends DiyReact.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }
  like() {
    this.setState({
      likes: this.state.likes + 1
    });
  }
  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    const likesElement = <span />;
    return (
      <li>
        <button onClick={e => this.like()}>{likes}<b>❤️</b></button>
        <a href={url}>{name}</a>
      </li>
    );
  }

  // shouldcomponentUpdate() {
  //   return true;
  // }

  componentWillUpdate() {
    console.log('execute componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('execute componentDidUpdate');
  }

}

DiyReact.render(<App stories={stories} />, document.getElementById("root"));

function importFromBelow() {
  const TEXT_ELEMENT = "TEXT_ELEMENT"

  function updateDomProperties(dom, prevProps, nextProps) {
    const isEvent = name => name.startsWith("on");
    const isAttribute = name => !isEvent(name) && name != "children";

    Object.keys(prevProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    })

    Object.keys(prevProps).filter(isAttribute).forEach(name => {
      dom[name] = null;
    })

    Object.keys(nextProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    })
    console.log(nextProps, 'nextProps');
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
      dom[name] = nextProps[name];
    })
  }


  let rootInstance = null;
  function render(element, parentDom) {
    const prevInsatnce = rootInstance;
    const nextInstance = rencocile(parentDom, prevInsatnce, element);
    rootInstance = nextInstance;
  }

  function rencocile(parentDom, instance, element) {
    if (instance === null) {
      const newInstance = instantiate(element);
      newInstance.publicInstance
        && newInstance.publicInstance.componentWillMount
        && newInstance.publicInstance.componentWillMount()

      parentDom.appendChild(newInstance.dom)
      newInstance.publicInstance
        && newInstance.publicInstance.componentDidMount
        && newInstance.publicInstance.componentDidMount()
    } else if (element === null) {
      instance.publicInstance
        && instance.publicInstance.componentWillUnMount
        && instance.publicInstance.componentWillUnMount();

      parentDom.removeChild(instance.dom)
    } else if (instance.element.type !== element.type) {
      const newInstance = instantiate(element);
      // componentDidMount
      newInstance.publicInstance
        && newInstance.publicInstance.componentDidMount
        && newInstance.publicInstance.componentDidMount();
      parentDom.replaceChild(newInstance.dom, instance.dom);
      return newInstance;
    } else if (typeof element.type === 'string') {
      updateDomProperties(instance.dom, instance.element.props, element.props);
      instance.childInstances = reconcileChildren(instance, element);
      instance.element = element;
      return instance;
    } else {
      if (instance.publicInstance
        && instance.publicInstance.shouldcomponentUpdate) {
        if (!instance.publicInstance.shouldcomponentUpdate()) {
          return;
        }
      }
      // componentWillUpdate
      instance.publicInstance
        && instance.publicInstance.componentWillUpdate
        && instance.publicInstance.componentWillUpdate();
      instance.publicInstance.props = element.props;
      const newChildElement = instance.publicInstance.render();
      const oldChildInstance = instance.childInstance;
      const newChildInstance = reconcile(parentDom, oldChildInstance, newChildElement);
      // componentDidUpdate
      instance.publicInstance
        && instance.publicInstance.componentDidUpdate
        && instance.publicInstance.componentDidUpdate();
      instance.dom = newChildInstance.dom;
      instance.childInstance = newChildInstance;
      instance.element = element;
      return instance;
    }
  }

  function reconcileChildren(instance, element) {
    const { dom, childInstance } = instance;
    const newChildsElements = element.props.children || [];
    const count = Math.max(childInstance.length, newChildsElements.length);
    for (let i = 0; i < count; i++) {
      newChildsElements[i] = reconcile(dom, childInstance[i], newChildsElements[i]);
    }
    return newChildsElements.filter(instance => instance !== null)
  }

  function instantiate(element) {
    if (typeof element !== "object") {
      const dom = document.createTextNode(element)
      const instance = { element, dom }
      return instance;
    }
    const { type, props = {} } = element;
    const isDomElement = typeof type === "string" || typeof element === "number";

    if (isDomElement) {
      const isTextElement = type === TEXT_ELEMENT;
      const dom = isTextElement ? document.createTextNode(element) : document.createElement(type);
      updateDomProperties(dom, [], element.props);
      const children = props.children || [];
      const childInstance = children.map(instantiate);
      const childDom = childInstance.map(v => v.dom);
      childDom.map(v => dom.appendChild(v))
      const instance = { element, dom, childInstance }
      return instance;

    } else {
      const instance = {};
      const publicInstance = createPublicInstance(element, instance);
      const childElement = publicInstance.render();
      const childInstance = instantiate(childElement);
      Object.assign(instance, { dom: childInstance.dom, element, childInstance, publicInstance })
      return instance;
    }
  }

  function createPublicInstance(element, instance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = instance;
    return publicInstance;

  }

  function createTextElement(value) {
    return createElement(TEXT_ELEMENT, { nodeValue: value })
  }

  function createElement(type, props, ...children) {
    props = Object.assign({}, props);
    props.children = [].concat(...children).filter(child => child != null && child != false).map(child => child instanceof Object ? child : createTextElement(child));
    return {
      type,
      props,
    }
  }

  class Component {
    constructor(props) {
      this.props = props;
      this.state = this.state || {};
    }

    setState(partialState) {
      this.state = Object.assign({}, this.state, partialState);
      // update instance
      const parentDom = this.__internalInstance.dom.parentNode;
      const element = this.__internalInstance.element;
      reconcile(parentDom, this.__internalInstance, element);
    }
  }


  return {
    render,
    Component,
    createElement
  }
}
