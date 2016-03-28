var webpack = require('webpack');

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
    }
};

if(process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: 'production'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warning: false
            }
        })
    ];
}else {
    module.exports.devtool = '#source-map';
    // module.exports.proxy = {
    //     '': {
    //         target: 'http://localhost:3000',
            
    //     }
    // };
}

