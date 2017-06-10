import BaseController from './BaseController';

import { cache } from '../cache';

/**
 * The CacheController controls the cache for the system.
 */
class CacheController extends BaseController {
    /**
     * This returns a listing of all keys in the cache.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async index(req, res) {
        const cacheKeys = await cache.keys();

        return res.json(cacheKeys);
    }
}

export default CacheController;
