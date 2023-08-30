var http = require("http");
var fs = require("fs");
var path = require("path"); // Required for file paths

http
  .createServer(function (req, res) {
    var filePath = "." + req.url;
    if (filePath === "./") {
      filePath = "./main.html";
    }

    var extname = path.extname(filePath);
    var contentType = "text/html";

    if (extname === ".css") {
      contentType = "text/css";
    }

    if (extname === ".js") {
      contentType = "text/javascript";
    }

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end("File not found!");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      }
    });
    
  })
  .listen(6969);
