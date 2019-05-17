function foo(string, ...values) {
  console.log(string);
  console.log(values);
}
const name = "huhu";

const age = 18;

foo`My name is ${name}! age ${age}`;

const tag = (string, ...values) =>
  string.reduce((s, v, idx) => {
    return s + (idx > 0 ? values[idx - 1] : "") + v;
  }, "");

const test = tag`My name is ${name}! age ${age}`;

console.log(test);

String.prototype.render = function(obj) {
  // 利用了ES6的解构、对象keys新方法，在函数内部解构并自动展开变量
  eval(`var {${Object.keys(obj).join(",")}} = obj`);
  // 利用eval使字符串直接作为ES6解析
  return eval("`" + this + "`");
};
var greeting = "My name is ${name}, age ${age}, I am a ${job.jobName}";
var employee = {
  name: "XiaoMing",
  age: 11,
  job: {
    jobName: "designer",
    jobLevel: "senior"
  }
};
var result = greeting.render(employee);
console.log(result);
