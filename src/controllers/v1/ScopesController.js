import BaseController from '../BaseController';

import OAuthScope from '../../models/oauth/OAuthScope';

class ScopesController extends BaseController {
    /**
     * This returns all the scopes for the OAuth system.
     *
     * @param {Object} req
     * @param {Object} res
     * @returns {Object}
     */
    static async index(req, res) {
        const scopes = await OAuthScope.query().select(['name', 'description']);
        return res.json(scopes);
    }
}

export default ScopesController;