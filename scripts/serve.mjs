import http from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const root = await realpath(path.resolve(fileURLToPath(new URL('../', import.meta.url)), option('--dir', '.')));
const port = Number(option('--port', process.env.PORT || '5173'));
const prefix = '/' + option('--base', '/').split('/').filter(Boolean).join('/');
const base = prefix === '/' ? '/' : prefix + '/';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8' };
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (base !== '/' && pathname === prefix) { res.writeHead(301, { Location: base }); res.end(); return; }
    if (!pathname.startsWith(base)) { res.writeHead(404); res.end('Not found'); return; }
    const relative = pathname.slice(base.length) || 'index.html';
    if (relative.split('/').some(part => part.startsWith('.'))) { res.writeHead(404); res.end('Not found'); return; }
    let target = path.resolve(root, relative);
    const withinRoot = file => file === root || file.startsWith(root + path.sep);
    if (!withinRoot(target)) { res.writeHead(404); res.end('Not found'); return; }
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    target = await realpath(target);
    if (!withinRoot(target)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Content-Length': data.length, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    res.writeHead(error instanceof URIError ? 400 : 404);
    res.end(error instanceof URIError ? 'Invalid URL' : 'Not found');
  }
});
server.listen(port, '0.0.0.0', () => console.log(`Static site listening on port ${port}, path ${base}`));
