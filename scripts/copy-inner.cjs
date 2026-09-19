const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const source = path.join(root, 'inner-site/dist');
const destination = path.join(root, 'public/os');
const publicRoot = path.join(root, 'public') + path.sep;

if (!destination.startsWith(publicRoot)) {
  throw new Error('Refusing to replace a directory outside public/.');
}

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });
console.log('Personalized desktop copied to public/os.');
