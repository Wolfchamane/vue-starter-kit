const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackDevMiddleare = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const connectHistoryAPIFallback = require('connect-history-api-fallback');

let server;
let readyPromise;
module.exports = {
    run(config)
    {

        let webpackConfig = require('../webpack/dev');

        // default port where dev server listens for incoming traffic
        let port = process.env.PORT || config.port;
        // automatically open browser, if not set will be false
        let autoOpenBrowser = config.autoOpenBrowser;
        // Define HTTP proxies to your custom API backend
        // https://github.com/chimurai/http-proxy-middleware
        let proxyTable = config.proxyTable;

        let app = express();
        let compiler = webpack(webpackConfig);

        let devMiddleware = webpackDevMiddleare(compiler, {
            publicPath  : webpackConfig.output.publicPath,
            quiet       : true
        });

        let hotMiddleware = webpackHotMiddleware(compiler, {
            log()
            {}
        });

        // force page reload when html-webpack-plugin template changes
        compiler.plugin('compilation', compilation =>
        {
            compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
                hotMiddleware.publish({action : 'reload'});
                cb();
            });
        });

        // proxy api requests
        Object.keys(proxyTable).forEach(context =>
        {
            let options = proxyTable[context];
            if (typeof options === 'string')
            {
                options = {target : options};
            }
            app.use(proxyMiddleware(options.filter || context, options));
        });

        // handle fallback for HTML5 history API
        app.use(connectHistoryAPIFallback());

        // serve webpack bundle output
        app.use(devMiddleware);

        // enable hot-reload and state-preserving
        // compilation error display
        app.use(hotMiddleware);

        // serve pure static assets
        let staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory);
        app.use(staticPath, express.static('./static'));

        let uri = 'http://localhost:' + port;

        let _resolve;
        readyPromise = new Promise(resolve =>
        {
            _resolve = resolve;
        });

        console.log('> Starting dev server...');
        devMiddleware.waitUntilValid(() =>
        {
            console.log('> Listening at ' + uri + '\n');
            // when env is testing, don't need open it
            if (autoOpenBrowser && process.env.NODE_ENV !== 'testing')
            {
                opn(uri);
            }
            _resolve();
        });
        server = app.listen(port);
    },
    ready : readyPromise,
    close()
    {
        server.close();
    }
};
