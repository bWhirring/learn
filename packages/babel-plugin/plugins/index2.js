const visitor = {
  Identifier(path) {
    console.log("index2");
  }
};

module.exports = () => {
  return {
    visitor
  };
};
