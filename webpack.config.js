const webpack = require('webpack');
const PATH    = require('path');

module.exports = {
    devtool: false,
    mode   : "production",
    entry  : [ "@babel/polyfill", './src/chatWindow.js' ],
    output : {
        publicPath: 'http://localhost:6234/dist/',
        filename  : 'chatWindow.bundle.js',
        path      : __dirname + '/dist'
    },
    module : {
        rules: [
            {
                test: /\.less$/,
                use : [ {
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                } ]
            },
            {
                test: /\.css$/,
                use : [ 'style-loader', 'css-loader' ]
            },
            {
                test   : /\.js$/,
                exclude: /node_modules/,
                loader : 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
}
