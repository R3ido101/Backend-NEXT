import passport from 'passport';
import { Router } from 'express';
import * as httpStatusCode from 'http-status';

import Role from '../models/Role';
import { cacheWrap } from '../cache';
import APIError from '../errors/APIError';
import { checkRole, checkScope } from '../middleware';
import RolesController from '../controllers/RolesController';

export default () => {
    const routes = Router();

    routes.use(passport.authenticate('bearer', {session: false}));
    routes.use(checkRole('admin'));

    routes.param('role_id', async function (req, res, next, roleId) {
        const role = await cacheWrap(req, () => (Role.query().findById(roleId)), 'role');

        if (!role) {
            return next(new APIError(`Role with ID of ${roleId} not found.`, httpStatusCode.NOT_FOUND));
        }

        // attach the role to the request
        req.role = role;

        return next();
    });

    routes.get('/', checkScope('admin:read'), RolesController.index);
    routes.get('/:role_id', checkScope('admin:read'), RolesController.get);
    routes.post('/', checkScope('admin:write'), RolesController.post);
    routes.put('/:role_id', checkScope('admin:write'), RolesController.put);
    routes.delete('/:role_id', checkScope('admin:write'), RolesController.delete);

    return routes;
}