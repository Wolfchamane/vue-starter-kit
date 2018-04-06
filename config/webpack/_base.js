const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Returns the proper base endpoint host for each environment.
 * @param   {String} key Environment
 * @return  {*} String
 * @private
 */
function _host(key)
{
    return {
        pro : '',
        dev : 'http://localhost:3000'
    }[key];
}

function resolve(_path)
{
    return path.resolve(__dirname, ['../..', _path].join('/'));
}

module.exports = env =>
{
    let IS_PRO = env === 'pro';
    return {
        target  : 'web',
        entry   : {
            app : resolve('src/main.js')
        },
        output  : {
            path            : resolve((IS_PRO ? 'dist' : 'build')),
            pathinfo        : true,
            filename        : `[name]${(IS_PRO ? '.min' : '')}.js`
        },
        module  : {
            rules   : [
                {
                    test    : /\.(js|vue)$/,
                    loader  : 'eslint-loader',
                    enforce : 'pre',
                    include : [
                        resolve('src'),
                        resolve('node_modules/vue-awesome')
                    ],
                    options : {
                        formatter   : require('eslint-friendly-formatter'),
                        loaders     : {
                            scss  : 'vue-style-loader!css-loader!sass-loader',
                            sass  : 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                        }
                    }
                },
                {
                    test    : /\.vue$/,
                    loader  : 'vue-loader',
                    options : {
                        loaders : {
                            scss    : 'vue-style-loader!css-loader!sass-loader',
                            sass    : 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                            css     : ExtractTextPlugin.extract({
                                use         : 'css-loader',
                                fallback    : 'vue-style-loader'
                            }),
                            js      : 'babel-loader!eslint-loader'
                        }
                    }
                },
                {
                    test    : /\.js$/,
                    loader  : 'babel-loader',
                    include : [
                        resolve('src')
                    ]
                },
                {
                    test    : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader  : 'url-loader',
                    options : {
                        limit   : 10000,
                        name    : 'img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test    : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader  : 'url-loader',
                    options : {
                        limit   : 10000,
                        name    : 'fonts/[name].[hash:7].[ext]'
                    }
                }
            ]
        },
        plugins : [
            new ExtractTextPlugin('style.css'),
            new webpack.DefinePlugin({
                ENVIRONMENT : JSON.stringify(_host(env))
            }),
            new HtmlWebpackPlugin({
                filename    : 'index.html',
                template    : 'index.html',
                inject      : true,
                minify      : {
                    removeComments          : IS_PRO,
                    collapseWhitespace      : IS_PRO,
                    removeAttributeQuotes   : IS_PRO
                }
            })
        ],
        resolve : {
            extensions  : ['.js', '.vue', '.json'],
            alias       : {
                'vue$'  : 'vue/dist/vue.esm.js',
                '@'     : resolve('src')
            }
        }
    };
};
