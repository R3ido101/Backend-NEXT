import authRoutes from './routes/auth';
import docsRoutes from './routes/docs';
import rootRoutes from './routes/root';
import cacheRoutes from './routes/cache';
import oauthRoutes from './routes/oauth';
import rolesRoutes from './routes/roles';
import usersRoutes from './routes/users';
import scopesRoutes from './routes/scopes';

export default (app) => {
    // root routes
    app.use('/', rootRoutes());

    // login routes
    app.use('/auth', authRoutes());

    // oauth routes
    app.use('/oauth', oauthRoutes());

    // documentation routes
    app.use('/docs', docsRoutes());

    // bELOW ARE ROUTES FOR THE ACTUAL API CALLS

    // cache routes
    app.use('/cache', cacheRoutes());

    // roles routes
    app.use('/roles', rolesRoutes());

    // scopes routes
    app.use('/scopes', scopesRoutes());

    // users routes
    app.use('/users', usersRoutes());
};
