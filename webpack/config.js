'use strict';

global.PATHS = {
    src: './src',
    build: './build'
};

var devServer = require('./components/dev-server');
var jsLoader = require('./components/js-loader');
var plugins = require('./components/plugins');

var webpackConfig = {
    entry: PATHS.src,
    output: {
        path: PATHS.build,
        filename: 'angular.js'
    },
    module: {
        loaders: [jsLoader]
    },
    devtool: "source-map",
    plugins: plugins,
    devServer: devServer
};

module.exports = webpackConfig;