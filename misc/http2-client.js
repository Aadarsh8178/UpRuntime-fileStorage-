/**
 * Example HTTP2 client
 */

var http2 = require("http2");

//Create Client
var client = http2.connect("http://localhost:6000");

//Create a request
var req = client.request({
  ":path": "/",
});

//Create a request
var str = "";
req.on("data", (chunk) => {
  str += chunk;
});

//When the message ends, log it out
req.on("end", () => {
  console.log(str);
});

//End the request
req.end();
