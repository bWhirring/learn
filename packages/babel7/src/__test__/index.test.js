import React from "react";
import App from "../App";
import renderer from "react-test-renderer";

test("test App.js", () => {
  const component = renderer.create(<App />);
  let tree = component.toJSON();
  // console.log(tree);
  expect(tree).toMatchSnapshot();
});
