const path = require("path");
const http = require("http");
const fs = require("fs");
const url = require("url");

function getContentType(ext) {
  let contentType = "";
  switch (ext) {
    case "js":
      contentType = "text/javascript";
      break;
    case "css":
      contentType = "text/css";
      break;
    case "jpg":
    case "jpeg":
      contentType = "image/jpeg";
      break;
    case "png":
      contentType = "image/png";
      break;
    case "gif":
      contentType = "image/gif";
      break;
    case "svg":
      contentType = "image/svg+xml";
      break;
    case "html":
      contentType = "text/html; charset=UTF-8";
      break;
  }
  return contentType;
}

function start() {
  const basepath = path.resolve(__dirname, "build");
  http
    .createServer((request, response) => {
      let pathname = url.parse(request.url).pathname;
      pathname = pathname.substring(1, pathname.length);
      if (pathname === "" || pathname === "#/") pathname = "index.html";

      let ext = pathname.match(/(?<=\.)[^\.]+$/);
      let contentType = getContentType(ext[0]);

      const filepath = path.resolve(basepath, pathname);
      const data = fs.readFileSync(filepath, "utf-8");

      response.writeHead(200, { "Content-Type": contentType });
      response.write(data);
      response.end();
    })
    .listen(8083);
}

module.exports = { start };
