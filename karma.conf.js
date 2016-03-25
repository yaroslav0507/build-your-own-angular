const istanbul = require('browserify-istanbul');

module.exports = function (config) {
    config.set({

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'mocha', 'chai', 'sinon-chai'],

        // list of files / patterns to load in the browser
        files: [
            './test.config.js',
            './src/index.js',
            './src/**/*.spec.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            './src/index.js': ['browserify'],
            './src/**/*.spec.js': ['browserify']
        },

        browserify: {
            debug: true,
            configure: function(bundle) {
                bundle.once('prebundle', function() {
                    bundle
                        .transform('babelify')
                        .transform(istanbul({
                            instrumenterConfig: { embedSource: true }
                        }))
                });
            }
        },
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'PhantomJS'
            //'PhantomJS2',
            //'Chrome'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
};