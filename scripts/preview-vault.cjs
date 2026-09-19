// Local screenshot preview: blocks cloud connections so private vault data is not loaded.
const express = require('express');
const path = require('node:path');
const app = express();
const previewRoot = path.resolve(__dirname, '../artifacts/sources/vault/docs');
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "connect-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com;");
  next();
});
app.get('/flutter_bootstrap.js', (req, res) => {
  const code = require('node:fs').readFileSync(path.join(previewRoot, 'flutter_bootstrap.js'), 'utf8');
  res.type('application/javascript').send(code.replace('_flutter.loader.load({', "_flutter.loader.load({config: {canvasKitBaseUrl: '/canvaskit/'},"));
});
app.get('/main.dart.js', (req, res) => {
  const code = require('node:fs').readFileSync(path.join(previewRoot, 'main.dart.js'), 'utf8');
  res.type('application/javascript').send(code.replaceAll('islambenaboud007@gmail.com', 'demo@example.com'));
});
app.use(express.static(previewRoot));
app.listen(3032, '127.0.0.1', () => console.log('Isolated Vault preview: http://127.0.0.1:3032/'));
