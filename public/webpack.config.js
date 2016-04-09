var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'app.js',
        path: './dist'
    },
    resolve: {
        alias: {

        }
    },
    module: {
        noParse: [],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }]
    },
    vue: {
        loaders: {
          sass: ExtractTextPlugin.extract('css!sass'),
        }
    },
    plugins: [
        new ExtractTextPlugin('app.css', {
            allChunks: true // 默认只对入口分支处理，设置true，对异步生成的所有chunk也处理
        })
    ]
};

if(process.env.NODE_ENV === 'production') {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"' // 注意：'"...
          }
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]);
}else {
    module.exports.devtool = '#source-map';
    // module.exports.proxy = {
    //     '': {
    //         target: 'http://localhost:3000',
            
    //     }
    // };
}

