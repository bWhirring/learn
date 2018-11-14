//首先要写一个options
let options = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "GET",
  headers: {}
};
let fs = require("fs");
let http = require("http");
let ws = fs.createWriteStream("./download.txt");
let start = 0;
// 下载，每次获取10个
function download() {
  options.headers = {
    Range: `bytes=${start}-${start + 10}`
  };
  start += 10;
  // 发请求
  http.get(options, function(res) {
    let range = res.headers["content-range"];
    console.log(range, "range");
    let total = range.split("/")[1];
    console.log(total, "total");
    let buffers = []; //创建一个缓存区，把读到的数据都放在里面
    //，等到end的时候就整个取出来。
    res.on("data", function(chunk) {
      buffers.push(chunk);
    });
    res.on("end", function() {
      //将获取的数据写入到文件中
      ws.write(Buffer.concat(buffers));
      setTimeout(function() {
        if (start < total) {
          download();
        }
      }, 1000);
    });
  });
}
download();
