import BaseController from './BaseController';

/**
 * The RootController controls the routes for the root of the API.
 */
class AuthController extends BaseController {
    /**
     * This returns the current version of the api as defined in the package.json.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static login(req, res) {
        return res.render('login', {error: req.flash('error')});
    }

    /**
     * This returns the current version of the api as defined in the package.json.
     *
     * @param {object} req
     * @param {object} res
     */
    static logout(req, res) {
        const redirectUrl = req.header('Referer') || '/';

        req.logout();
        res.redirect(redirectUrl);
    }
}

export default AuthController;
