const {merge}=require('webpack-merge');
const common=require('./webpack.common.js');
module.exports=merge(common,{mode:'development',stats:'errors-warnings',devServer:{host:'127.0.0.1',port:3000,open:false,hot:false,watchFiles:['src/**','static/**'],proxy:[{context:['/os'],target:'http://127.0.0.1:5173'}],client:{overlay:true}}});
