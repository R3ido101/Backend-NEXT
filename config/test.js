const getPort = require('get-port-sync');

// eslint-disable-next-line immutable/no-mutation
require('events').EventEmitter.defaultMaxListeners = 100;

module.exports = {
    port: getPort(),
    baseUrl: 'http://127.0.0.1:3001',
};
