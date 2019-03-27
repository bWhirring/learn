const visitor = {
  Identifier(path) {
    console.log("index1");
  }
};

module.exports = () => {
  return {
    visitor
  };
};
