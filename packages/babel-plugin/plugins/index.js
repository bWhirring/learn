const visitor = {
  Identifier(path) {
    console.log("index");
  }
};

module.exports = (babel) => {
  return {
    visitor
  };
};
