const axios = require("axios");

axios.default
  .get("http://baidu.com", {
    headers: {
      Range: "bytes=10-20"
    }
  })
  .then(r => {
    console.log(r.headers);
    console.log(r.data.length);
  });
