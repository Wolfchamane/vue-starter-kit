const webpack = require('webpack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
let base = require('./_base')('dev');
base.plugins.push(new webpack.HotModuleReplacementPlugin());
base.plugins.push(new webpack.NoEmitOnErrorsPlugin());
base.plugins.push(new FriendlyErrorsPlugin());
base.devtool = '#inline-source-map';
module.exports = base;
