const path = require("path");
const http = require("http");
const fs = require("fs");
const url = require("url");

const mimes = {
  acc: 'audio/acc',
  abw: 'application/x-abiword',
  arc: 'application/x-freearc',
  avi: 'video/x-msvideo',
  azw: 'application/vnd.amazon.ebook',
  bin: 'application/octet-stream',
  bmp: 'image/bmp',
  bz: 'application/x-bzip',
  bz2: 'application/x-bzip2',
  csh: 'application/x-csh',
  css: 'text/css',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  eot: 'application/vnd.ms-fontobject',
  epub: 'application/epub+zip',
  gif: 'image/gif',
  htm: 'text/html',
  html: 'text/html',
  ico: 'image/vnd.microsoft.icon',
  ics: 'text/calendar',
  jar: 'application/java-archive',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  jsonld: 'application/ld+json',
  mid: 'audio/midi',
  midi: 'audio/midi',
  mjs: 'text/javascript',
  mp3: 'audio/mpeg',
  mpeg: 'video/mpeg',
  mpkg: 'application/vnd.apple.installer+xml',
  odp: 'application/vnd.oasis.opendocument.presentation',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odt: 'application/vnd.oasis.opendocument.text',
  oga: 'audio/ogg',
  ogv: 'video/ogg',
  ogx: 'application/ogg',
  otf: 'font/otf',
  png: 'image/png',
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  rar: 'application/x-rar-compressed',
  rtf: 'application/rtf',
  sh: '	application/x-sh',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tar: 'application/x-tar',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  ttf: 'font/ttf',
  txt: 'text/plain',
  vsd: 'application/vnd.visio',
  wav: 'audio/wav',
  weba: 'audio/webm',
  webm: 'video/webm',
  webp: 'image/webp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  xhtml: 'application/xhtml+xml',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml: 'application/xml',
  xul: 'application/vnd.mozilla.xul+xml',
  zip: 'application/zip',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
  '7z': 'application/x-7z-compressed'
}

function start() {
  const basepath = path.resolve(__dirname, "build");

  return new Promise((resolve, reject) => {
    let server = http.createServer((request, response) => {
      let pathname = url.parse(request.url).pathname;
      let filename = pathname.substring(1, pathname.length);
      if (filename === "" || filename === "#/") filename = "index.html";

      let ext = filename.match(/(?<=\.)[^\.]+$/);
      let contentType = mimes[ext] ? mimes[ext] : 'text/plain';

      const filepath = path.resolve(basepath, filename);
      const data = fs.readFileSync(filepath, "utf-8");

      response.writeHead(200, { "Content-Type": contentType });
      response.write(data);
      response.end();
    });
    let port = 8083;
    server.listen(port);
    server.on("listening", () => {
      resolve({
        server,
        port
      });
    });
    server.on("error", () => {
      server.listen(++port);
    });
  });
}

module.exports = { start };
