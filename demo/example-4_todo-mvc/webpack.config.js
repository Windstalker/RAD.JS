var webpack = require("webpack");

module.exports = {
    entry: "./js/app.js",
    output: {
        path: __dirname + '/build',
        filename: "todo.mvc.js"
    },

    // Define global variable names that could be required inside module
    externals: {
        "RAD": "RAD",
        "jQuery": "jQuery",
        "Backbone": "Backbone",
        "underscore": "_",
        "FastClick": "FastClick"
    },
    resolve: {
        alias: {
            views: __dirname + '/js/views',
            models: __dirname + '/js/models'
        }
    },
    module: {
        loaders: [
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                loader: 'itemplate-loader',
                query: {
                    // pass itemplate option here
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({output: {comments: false}})
    ]
};