import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const rootFile = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  const publicFile = path.join(__dirname, 'public', urlPath === '/' ? 'index.html' : urlPath);

  if (fs.existsSync(rootFile) && fs.statSync(rootFile).isFile()) {
    serveFile(res, rootFile);
  } else if (fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) {
    serveFile(res, publicFile);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(PORT, '::', () => {
  console.log(`Static server running on port ${PORT}`);
});
