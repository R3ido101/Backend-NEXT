import passport from 'passport';
import { Router } from 'express';
import validate from 'validate.js';
import * as httpStatusCode from 'http-status';

import Role from '../../models/Role';
import User from '../../models/User';
import { cacheWrap } from '../../cache';
import APIError from '../../errors/APIError';
import * as roleValidations from '../../validation/roles';
import * as userValidations from '../../validation/users';
import { checkRole, checkScope } from '../../middleware';
import UsersController from '../../controllers/v1/UsersController';

export default () => {
    const routes = Router();

    routes.use(passport.authenticate('bearer', {session: false}));
    routes.use(checkRole('admin'));

    routes.param('user_id', async function (req, res, next, userId) {
        try {
            await validate.async({id: userId}, userValidations.VALIDATE_ID);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const user = await cacheWrap(req, () => (User.query().findById(userId)), 'role');

        if (!user) {
            return next(new APIError(`User with ID of ${userId} not found.`, httpStatusCode.NOT_FOUND));
        }

        // attach the user to the request
        req.user = user;

        return next();
    });

    routes.param('role_id', async function (req, res, next, roleId) {
        try {
            await validate.async({id: roleId}, roleValidations.VALIDATE_ID);
        } catch (errors) {
            return next(new APIError(errors, httpStatusCode.BAD_REQUEST));
        }

        const role = await cacheWrap(req, () => (Role.query().findById(roleId)), 'user');

        if (!role) {
            return next(new APIError(`Role with ID of ${roleId} not found.`, httpStatusCode.NOT_FOUND));
        }

        // attach the role to the request
        req.role = role;

        return next();
    });

    routes.get('/', checkScope('admin:read'), UsersController.index);
    routes.get('/:user_id', checkScope('admin:read'), UsersController.get);
    routes.post('/', checkScope('admin:write'), UsersController.post);
    routes.put('/:user_id', checkScope('admin:write'), UsersController.put);
    routes.delete('/:user_id', checkScope('admin:write'), UsersController.delete);

    routes.get('/:user_id/roles', checkScope('admin:read'), UsersController.getRole);
    routes.put('/:user_id/roles/:role_id', checkScope('admin:write'), UsersController.putRole);
    routes.delete('/:user_id/roles/:role_id', checkScope('admin:write'), UsersController.deleteRole);

    return routes;
}