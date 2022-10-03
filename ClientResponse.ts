import fs from "fs";
import path from "path";
import { RequestListener } from "http";

const map: { [key: string]: string } = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
};

export const response: RequestListener = (req, res) => {
  if (req.url?.includes("public")) {
    const filePath = `./${req.url}`;

    let extname = path.extname(filePath);

    const isExist = fs.existsSync(filePath);
    if (!isExist) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Page Not Found");
      res.end();
      return;
    }

    const isDirectory = fs.statSync(filePath).isDirectory();
    if (isDirectory) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("Page Not Found");
      res.end();
      return;
    }

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader("Content-type", map[extname] || "text/plain");
        res.write(data);
        res.end();
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("Everything ready");
  res.end();
};
