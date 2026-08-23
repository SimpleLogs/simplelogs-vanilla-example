// A dependency-free static server, so `npm start` needs nothing installed.
//
// You do not need this file in your own project — it exists only so the page
// is served over http:// rather than opened as file://, which is what the
// dashboard's origin allowlist expects.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const PORT = 5173;

http
  .createServer((req, res) => {
    const url = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const file = path.join(publicDir, path.normalize(url));

    // Never serve outside public/ — a request for /../serve.js normalizes to a
    // path above the root, and this is the check that refuses it.
    if (!file.startsWith(publicDir)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    fs.readFile(file, (err, body) => {
      if (err) {
        res.writeHead(404).end("Not found");
        return;
      }
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "text/plain" });
      res.end(body);
    });
  })
  .listen(PORT, () => console.log(`Example on http://localhost:${PORT}`));
