const UglifyPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = config =>
{

    let base = require('./_base')('pro');
    base.plugins.push(new UglifyPlugin());
    base.plugins.push(new OptimizeCSSPlugin({
        cssProcessorOptions : {
            safe    : true
        }
    }));

    base.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name        : 'vendor',
        minChunks   : module =>
        {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../../node_modules')
                ) === 0
            );
        }
    }));

    base.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name    : 'manifest',
        chunks  : ['vendor']
    }));

    base.plugins.push(new CopyWebpackPlugin([{
        from    : path.resolve(__dirname, '../../static'),
        to      : config.assetsSubDirectory,
        ignore  : ['.*']
    }]));

    return base;
};
