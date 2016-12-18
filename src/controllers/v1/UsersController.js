import * as httpStatusCode from 'http-status';
import validate from 'validate.js';

import User from '../../models/User';
import APIError from '../../errors/APIError';
import BaseController from '../BaseController';

import { cacheWrap } from '../../cache';

import * as validations from '../../validation/users';

class ScopesController extends BaseController {
    /**
     * This returns all the users for the system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async index(req, res) {
        const users = await cacheWrap(req, () => (User.query().omit(['password'])));

        return res.json(users);
    }

    /**
     * This returns a single user in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async get(req, res, next) {
        const userId = req.params.user_id || null;

        try {
            await validate.async({id: userId}, validations.VALIDATE_ID);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const user = await cacheWrap(req, () => (User.query().findById(userId)));

        if (!user) {
            return next(new APIError(`User with ID of ${userId} not found.`, httpStatusCode.NOT_FOUND));
        }

        return res.json(user.$omit('password'));
    }

    /**
     * This creates a new user in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async post(req, res, next) {
        try {
            await validate.async(req.body, validations.POST);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const user = await User.query().insert(req.body);

        return res.json(user.$omit('password'));
    }

    /**
     * This changes the details for a user in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async put(req, res, next) {
        const userId = req.params.user_id || null;

        try {
            await validate.async({id: userId}, validations.VALIDATE_ID);

            const user = await User.query().findById(userId);

            if (!user) {
                return next(new APIError(`User with ID of ${userId} not found.`, httpStatusCode.NOT_FOUND));
            }

            await validate.async(req.body, validations.PUT);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const updatedUser = await User.query().patchAndFetchById(userId, req.body);

        return res.json(updatedUser.$omit('password'));
    }

    /**
     * This deleted a user in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async delete(req, res, next) {
        const userId = req.params.user_id || null;

        try {
            await validate.async({id: userId}, validations.VALIDATE_ID);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const user = await User.query().findById(userId);

        if (!user) {
            return next(new APIError(`User with ID of ${userId} not found.`, httpStatusCode.NOT_FOUND));
        }

        await User.query().deleteById(userId);

        return res.status(httpStatusCode.NO_CONTENT).end();
    }
}

export default ScopesController;