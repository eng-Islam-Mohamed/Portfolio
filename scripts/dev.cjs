const {spawn} = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const children = [
  spawn(process.execPath,[require.resolve('webpack-cli/bin/cli.js'),'serve','--config','bundler/webpack.dev.js'],{cwd:root,stdio:'inherit'}),
  spawn(process.execPath,[path.join(root,'inner-site/node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','5173','--strictPort'],{cwd:path.join(root,'inner-site'),stdio:'inherit'}),
];
const stop = () => {for(const child of children) child.kill();};
process.on('SIGINT',stop); process.on('SIGTERM',stop);
for(const child of children) child.on('exit',code=>{stop();process.exit(code||0);});
