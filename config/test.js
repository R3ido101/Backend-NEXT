const { promisify } = require('util');
const freeport = promisify(require('freeport'));

// eslint-disable-next-line immutable/no-mutation
require('events').EventEmitter.defaultMaxListeners = 100;

module.exports = async () => {
    const port = await freeport();

    return {
        port,
        baseUrl: 'http://127.0.0.1:3001',
    };
};
