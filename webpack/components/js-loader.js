'use strict';

module.exports = {
    test: /\.js?$/,
    exclude: /node_modules/,
    loader: "babel",
    query: {
        presets: ['es2015', 'stage-0']
    }
};