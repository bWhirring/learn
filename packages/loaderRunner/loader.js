const path = require("path")

module.exports = function(source) {
  var callback = this.async();
  callback(null, "asdsdasd")
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.value = 42;
};