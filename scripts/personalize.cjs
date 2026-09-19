const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const outerPath = path.join(root, 'package.json');
const outer = JSON.parse(fs.readFileSync(outerPath, 'utf8'));
outer.name = 'mohamed-islam-portfolio';
outer.private = true;
outer.license = 'MIT';
outer.repository = 'https://github.com/eng-Islam-Mohamed/Portfolio';
outer.scripts = {
  'install:all': 'npm install && npm --prefix inner-site install',
  'build:room': 'webpack --config ./bundler/webpack.prod.js',
  'build:desktop': 'npm --prefix inner-site run build',
  build: 'npm run build:room && npm run build:desktop && node scripts/copy-inner.cjs',
  start: 'node server/index.cjs',
  dev: 'node scripts/dev.cjs',
  typecheck: 'tsc --project src/tsconfig.json --noEmit && npm --prefix inner-site run typecheck',
};
for (const dep of ['body-parser', 'cors', 'nodemailer', 'ip', 'portfinder-sync']) delete outer.dependencies[dep];
Object.assign(outer.dependencies, {express:'^5.1.0','webpack-cli':'^6.0.1','webpack-dev-server':'^5.2.0',typescript:'^4.9.5'});
fs.writeFileSync(outerPath, JSON.stringify(outer,null,2)+'\n');
const innerPath = path.join(root,'inner-site/package.json');
const inner = JSON.parse(fs.readFileSync(innerPath,'utf8'));
inner.name = 'mohamed-islam-desktop';
for(const dep of ['react-scripts','@testing-library/jest-dom','@testing-library/react','@testing-library/user-event','@types/jest']) delete inner.dependencies[dep];
inner.dependencies.typescript = '^4.9.5';
inner.devDependencies = { vite:'^7.0.0' };
inner.scripts = { dev:'vite --host 127.0.0.1 --port 5173 --strictPort', build:'tsc --noEmit && vite build', typecheck:'tsc --noEmit' };
delete inner.eslintConfig;
fs.writeFileSync(innerPath, JSON.stringify(inner,null,2)+'\n');
const htmlPath = path.join(root,'inner-site/public/index.html');
let html = fs.readFileSync(htmlPath,'utf8');
html = html.replaceAll('%PUBLIC_URL%','/os').replace('<title>Henry Heffernan - OS</title>','<title>Mohamed Islam — IslamOS</title>');
html = html.replace('<base target="_parent">','<base target="_blank">');
html = html.replace('content=""','content="Mohamed Islam, software engineer from ESI. Explore WorldLens and ChronoLivre in a retro desktop."');
html = html.replace('</body>','<script type="module" src="/src/index.tsx"></script>\n</body>');
fs.writeFileSync(path.join(root,'inner-site/index.html'),html);
fs.writeFileSync(htmlPath,html.replace('<script type="module" src="/src/index.tsx"></script>',''));
fs.writeFileSync(path.join(root,'inner-site/src/react-app-env.d.ts'),'/// <reference types="vite/client" />\n');
let mainHTML = fs.readFileSync(path.join(root,'src/index.html'),'utf8');
mainHTML = mainHTML.replaceAll('Henry Heffernan','Mohamed Islam').replaceAll('Portfolio 2022','Portfolio 2026').replaceAll("I'm Henry, a Software Engineer based in NY. Rensselaer Polytechnic Institute Graduate with my B.S. in Computer Science, currently looking for a full time role.","I'm Mohamed Islam, a software engineer from ESI, the National Higher School of Computer Science in Algeria. Explore my web and AI projects.");
mainHTML = mainHTML.replaceAll('https://henryheffernan.com/images/preview-new.jpg','/images/preview-new.jpg');
mainHTML = mainHTML.replace(/\s*<meta[^>]*(?:og:url|twitter:url)[^>]*>/g,'');
mainHTML = mainHTML.replace(/\s*<!-- Google tag[^]*?<\/script>/,'');
mainHTML = mainHTML.replace(/\s*<script async src="https:\/\/www.googletagmanager.com[^]*?<\/script>/,'');
mainHTML = mainHTML.replace(/\s*<script>[^]*?gtag\([^]*?<\/script>/,'');
fs.writeFileSync(path.join(root,'src/index.html'),mainHTML);
const monitorPath = path.join(root,'src/Application/World/MonitorScreen.ts');
let monitor = fs.readFileSync(monitorPath,'utf8');
const iframeStart = monitor.indexOf('        // Set iframe attributes');
const iframeEnd = monitor.indexOf('        iframe.style.width',iframeStart);
monitor = monitor.slice(0,iframeStart)+"        // The personalized desktop is hosted alongside the 3D room.\n        iframe.src = '/os/';\n"+monitor.slice(iframeEnd);
monitor = monitor.replace("iframe.title = 'HeffernanOS'","iframe.title = 'IslamOS — Mohamed Islam portfolio'");
monitor = monitor.replace("window.addEventListener('message', (event) => {", "window.addEventListener('message', (event) => {\n                    if (event.origin !== window.location.origin || event.source !== iframe.contentWindow) return;\n                    if (!['mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup'].includes(event.data?.type)) return;");
fs.writeFileSync(monitorPath,monitor);
const overlayPath = path.join(root,'src/Application/UI/components/InfoOverlay.tsx');
fs.writeFileSync(overlayPath,fs.readFileSync(overlayPath,'utf8').replaceAll('Henry Heffernan','Mohamed Islam'));
const loadingPath = path.join(root,'src/Application/UI/components/LoadingScreen.tsx');
let loading = fs.readFileSync(loadingPath,'utf8').replaceAll('Henry Heffernan','Mohamed Islam').replaceAll('Heffernan,','Mohamed,').replaceAll('Henry Inc.','Islam Inc.').replaceAll('Heffernan Henry Inc.','Mohamed Islam Inc.').replaceAll('HHBIOS','MIBIOS').replaceAll('01/13/2000','09/17/2026').replaceAll('2000-2022','2026').replaceAll('Showcase 2022','Showcase 2026');
fs.writeFileSync(loadingPath,loading);
const manifestPath = path.join(root,'inner-site/public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.short_name = 'IslamOS'; manifest.name = 'Mohamed Islam Portfolio Showcase 2026'; manifest.start_url = '/os/';
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
