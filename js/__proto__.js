Object.defineProperty(Object.prototype, "__proto__", {
  get: function() {
    return Object.getPrototypeOf(this);
  },
  set: function(o) {
    Object.setPrototypeOf(this, o);
    return o;
  }
});
