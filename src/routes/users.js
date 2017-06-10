import passport from 'passport';
import { Router } from 'express';
import * as httpStatusCode from 'http-status';

import Role from '../models/Role';
import User from '../models/User';
import { cacheWrap } from '../cache';
import APIError from '../errors/APIError';
import { checkRole, checkScope } from '../middleware';
import UsersController from '../controllers/UsersController';

export default () => {
    const routes = Router();

    routes.use(passport.authenticate('bearer', {session: false}));
    routes.use(checkRole('admin'));

    routes.param('user_id', async function (req, res, next, userId) {
        const user = await cacheWrap(req, () => (User.query().findById(userId).eager('roles')), 'user');

        if (!user) {
            return next(new APIError(`User with ID of ${userId} not found.`, httpStatusCode.NOT_FOUND));
        }

        // attach the user to the request
        req.data = req.data || {};
        req.data.user = user;

        return next();
    });

    routes.param('role_id', async function (req, res, next, roleId) {
        const role = await cacheWrap(req, () => (Role.query().findById(roleId)), 'role');

        if (!role) {
            return next(new APIError(`Role with ID of ${roleId} not found.`, httpStatusCode.NOT_FOUND));
        }

        // attach the role to the request
        req.data = req.data || {};
        req.data.role = role;

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
};
