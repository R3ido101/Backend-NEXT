import config from 'config';
import cacheManager from 'cache-manager';

/**
 * Gets the store to use based on the configuration.
 *
 * @type {string}
 */
export const store = (
    config.cache.type === 'memory' ? 'memory' : require(`cache-manager-${config.get('cache.type')}`)
);

/**
 * Determines if the value can be cached or not.
 *
 * Does some basic checking on the value to check it's set and disabled caching for the test environment.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isCacheableValue(value) {
    return config.util.getEnv('NODE_ENV') !== 'test' && value !== null && value !== false;
}

/**
 * The cache instance.
 *
 * @type {object}
 */
export const cache = cacheManager.caching({
    store,
    ...config.cache.options,
    isCacheableValue,
});

/**
 * This will get the TTL configured based on if the user is logged in and their roles.
 *
 * -1 indicated to not cache at all.
 *
 * @param {object} req
 * @returns {number}
 */
function getTTL(req) {
    const user = req.user;

    if (!user) {
        return config.cache.ttl.guest;
    }

    if (user.hasRole('admin')) {
        return 10;
    }

    return config.cache.ttl.user;
}

/**
 * This is used to wrap a function up and cache the result based on the set cache rules.
 *
 * @param {object} req
 * @param {function} func
 * @param {string} [postfix='']
 * @returns {*}
 */
export async function cacheWrap(req, func, postfix = '') {
    const postfixToUse = postfix && ` - ${postfix}`;

    const ttl = getTTL(req);
    const name = `${req.method} ${req.baseUrl}${postfixToUse}`;

    if (req.method !== 'GET') {
        return await func();
    }

    return await cache.wrap(name, func, {ttl});
}
