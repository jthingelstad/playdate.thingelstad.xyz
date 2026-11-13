// Serve dist/ on http://127.0.0.1:4321/ the way CloudFront does: /x/ serves
// /x/index.html, a missing path gets 404.html with status 404.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { mime } from "./delivery-plan.mjs";

const port = Number(process.env.PORT || 4321);
http
  .createServer(async (req, res) => {
    let key = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (key.endsWith("/")) key += "index.html";
    const file = path.join("dist", path.normalize(key));
    try {
      if (!file.startsWith(`dist${path.sep}`)) throw new Error("outside dist");
      const body = await fs.readFile(file);
      res.writeHead(200, {
        "content-type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "content-type": mime[".html"] });
      res.end(await fs.readFile("dist/404.html"));
    }
  })
  .listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}/`));
