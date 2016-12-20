import { Router } from 'express';

import rootRoutes from './root';
import cacheRoutes from './cache';
import rolesRoutes from './roles';
import usersRoutes from './users';
import scopesRoutes from './scopes';

export default () => {
    const routes = Router();

    routes.use('/', rootRoutes());
    routes.use('/cache', cacheRoutes());
    routes.use('/roles', rolesRoutes());
    routes.use('/scopes', scopesRoutes());
    routes.use('/users', usersRoutes());

    return routes;
}
