import passport from 'passport';
import { Router } from 'express';

import { checkRole, checkScope } from '../../middleware';
import CacheController from '../../controllers/v1/CacheController';

export default () => {
    const routes = Router();

    routes.use(passport.authenticate('bearer', {session: false}));
    routes.use(checkRole('admin'));

    routes.get('/', checkScope('admin:read'), CacheController.index);

    return routes;
}