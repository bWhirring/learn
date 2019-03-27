const visitor = {
  Identifier(path) {
    console.log("index");
  }
};

module.exports = () => {
  return {
    visitor
  };
};
