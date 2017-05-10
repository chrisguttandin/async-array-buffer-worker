module.exports = {
    'continuous': {
        configFile: 'config/karma/config.js'
    },
    'expectation': {
        configFile: 'config/karma/config-expectation.js',
        singleRun: true
    },
    'test-integration': {
        configFile: 'config/karma/config-integration.js',
        singleRun: true
    },
    'test-unit': {
        configFile: 'config/karma/config-unit.js',
        singleRun: true
    }
};
