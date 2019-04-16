const visitor = {
  Identifier(path) {
    const { name } = path.node;
    path.node.name = name
      .split("")
      .reverse()
      .join("");
  }
};

module.exports = () => {
  return {
    visitor
  };
};
