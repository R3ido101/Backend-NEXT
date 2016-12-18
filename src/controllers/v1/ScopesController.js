import BaseController from '../BaseController';

import { cacheWrap } from '../../cache';

import OAuthScope from '../../models/oauth/OAuthScope';

class ScopesController extends BaseController {
    /**
     * This returns all the scopes for the OAuth system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async index(req, res) {
        const scopes = await cacheWrap(req, () => (OAuthScope.query().select(['name', 'description'])));

        return res.json(scopes);
    }
}

export default ScopesController;