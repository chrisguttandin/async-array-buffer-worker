const { env } = require('process');

module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 420000,

        files: [
            {
                included: false,
                pattern: 'src/**',
                served: true,
                watched: true
            },
            'test/expectation/any/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        mime: {
            'text/x-typescript': [ 'ts', 'tsx' ]
        },

        preprocessors: {
            'src/**/!(*.d).ts': 'webpack',
            'test/expectation/any/**/*.js': 'webpack'
        },

        webpack: {
            mode: 'development',
            module: {
                rules: [ {
                    test: /\.ts?$/,
                    use: {
                        loader: 'ts-loader'
                    }
                } ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

    if (env.TRAVIS) {

        config.set({

            browsers: [
                'ChromeSauceLabs',
                'SafariSauceLabs'
            ],

            captureTimeout: 480000,

            customLaunchers: {
                ChromeSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'chrome',
                    platform: 'OS X 10.14'
                },
                FirefoxSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'firefox',
                    platform: 'OS X 10.14'
                },
                SafariSauceLabs: {
                    base: 'SauceLabs',
                    browserName: 'safari',
                    platform: 'OS X 10.14'
                }
            },

            tunnelIdentifier: env.TRAVIS_JOB_NUMBER

        });

    } else {

        config.set({

            browsers: [
                'ChromeHeadless',
                'ChromeCanaryHeadless',
                'Safari'
            ],

            concurrency: 1

        });

    }

};
