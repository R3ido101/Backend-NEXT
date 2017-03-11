const fs = require('fs');
const mergeDeep = require('merge-deep');

const base = require('../config/base.json');
const test = require('../config/test.json');
const production = require('../config/production.json');
const development = require('../config/development.json');

const environment = process.env.NODE_ENV || 'development';

const secret = (fs.existsSync('../config/secret.json') ? require('../config/secret.json') : {});

// merge in secret last so it can overwrite all with the secret environment specific secrets being used last
const config = {
    test: mergeDeep(base, test, (secret.all || {}), (secret.test || {})),
    development: mergeDeep(base, development, (secret.all || {}), (secret.development || {})),
    production: mergeDeep(base, production, (secret.all || {}), (secret.production || {}))
};

/**
 * Gets the config object for the current environment.
 *
 * @returns {Object}
 */
function getConfig() {
    return config[environment];
}

module.exports = {
    environment,
    getConfig,
    config
};