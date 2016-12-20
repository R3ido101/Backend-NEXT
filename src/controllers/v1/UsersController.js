import validate from 'validate.js';
import * as httpStatusCode from 'http-status';

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
     * @returns {object}
     */
    static async get(req, res) {
        return res.json(req.user.$omit('password'));
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
        try {
            await validate.async(req.body, validations.PUT);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const updatedUser = await req.user.$query().patchAndFetch(req.body);

        return res.json(updatedUser.$omit('password'));
    }

    /**
     * This deleted a user in the system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async delete(req, res) {
        await req.user.$query().delete();

        return res.status(httpStatusCode.NO_CONTENT).end();
    }

    /**
     * This returns the roles for a user.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async getRole(req, res) {
        const roles = await req.user.$relatedQuery('roles');

        return res.json(roles);
    }

    /**
     * This adds the given role to the given user.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async putRole(req, res, next) {
        const hasRole = await req.user.$relatedQuery('roles').findById(req.role.id);

        if (hasRole) {
            return next(new APIError('User already has that role.', httpStatusCode.CONFLICT));
        }

        const roles = await req.user.$relatedQuery('roles').relate(req.role);

        return res.json(roles);
    }

    /**
     * This adds the given role to the given user.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async deleteRole(req, res, next) {
        const hasRole = await req.user.$relatedQuery('roles').findById(req.role.id);

        if (!hasRole) {
            return next(new APIError('User doesn\'t have that role.', httpStatusCode.NOT_FOUND));
        }

        await req.user.$relatedQuery('roles').unrelate().findById(req.role.id);

        return res.status(httpStatusCode.NO_CONTENT).end();
    }
}

export default ScopesController;