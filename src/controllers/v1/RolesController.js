import validate from 'validate.js';
import * as httpStatusCode from 'http-status';

import Role from '../../models/Role';
import APIError from '../../errors/APIError';
import BaseController from '../BaseController';

import { cacheWrap } from '../../cache';

import * as roleValidations from '../../validation/roles';

class RolesController extends BaseController {
    /**
     * This returns all the roles in the system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async index(req, res) {
        const roles = await cacheWrap(req, () => (Role.query()));

        return res.json(roles);
    }

    /**
     * This returns a single role in the system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async get(req, res) {
        return res.json(req.role);
    }

    /**
     * This creates a new role in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async post(req, res, next) {
        try {
            await validate.async(req.body, roleValidations.POST);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const role = await Role.query().insert(req.body);

        return res.json(role);
    }

    /**
     * This changes the details for a role in the system.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @returns {object}
     */
    static async put(req, res, next) {
        try {
            await validate.async(req.body, roleValidations.PUT);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const updatedRole = await req.role.$query().patchAndFetch(req.body);

        return res.json(updatedRole);
    }

    /**
     * This deleted a role in the system.
     *
     * @param {object} req
     * @param {object} res
     * @returns {object}
     */
    static async delete(req, res) {
        await req.role.$query().delete();

        return res.status(httpStatusCode.NO_CONTENT).end();
    }
}

export default RolesController;