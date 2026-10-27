// Tiny zero-dependency server: serves index.html and proxies /api/* to the
// Prediction Markets API on RapidAPI, keeping your key on the server.
// Support / faster replies: Telegram @pintoflow
const http = require('http');
const fs = require('fs');
const { RAPIDAPI_KEY, RAPIDAPI_HOST, PORT = 3000 } = process.env;
if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) { console.error('Set RAPIDAPI_KEY and RAPIDAPI_HOST'); process.exit(1); }

http.createServer(async (req, res) => {
  if (req.url.startsWith('/api/')) {
    try {
      const up = await fetch(`https://${RAPIDAPI_HOST}${req.url}`, {
        headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST },
      });
      res.writeHead(up.status, { 'content-type': 'application/json' });
      return res.end(await up.text());
    } catch (e) {
      res.writeHead(502, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ error: true, data: null, message: e.message }));
    }
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(PORT, () => console.log(`Dashboard on http://localhost:${PORT}`));
