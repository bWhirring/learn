const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer(async (req, res) => {
    let test = path.join(__dirname, "./test.txt");

    const file = fs.statSync(test);
    let start = 0;
    let end = file.size - 1;
    let range = req.headers["range"];

    if (range) {
      res.setHeader("Accept-Ranges", "bytes");
      // ['匹配的字符串','第一个分组']
      let result = range.match(/bytes=(\d*)-(\d*)/);
      start = result[1] ? parseInt(result[1]) : start;
      end = result[2] ? parseInt(result[2]) - 1 : end;
      res.setHeader("Content-Range", `${start}-${end}/${total}`);
      res.setHeader("Content-Type", "text/plain;charset=utf8");
      res.statusCode = 206;
      res.statusMessage = "Partial Content";
    }
    fs.createReadStream(p, { start, end }).pipe(res);
  })
  .listen(3001);
