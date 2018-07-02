const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk')
const qrcode = require('qrcode-terminal')

const webpackDevConfig = require('./webpack.dev.conf.js');


webpackDevConfig.then((data) => {
    console.log(chalk.red(`Webpack 编译编译中 请稍等。。。\n`));
    
    const compiler = webpack(data);
    let server = new WebpackDevServer(compiler, data.devServer);
    server.listen(data.devServer.port)

    compiler.hooks.done.tap("MyPlugin", () => {
        console.log(chalk.red(`手机扫码二维码 打开网页\n`));
        qrcode.generate(`http://${data.devServer.host}:${data.devServer.port}`,{small: true});
    })
})