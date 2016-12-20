import v1ApiRoutes from './v1';
import docsRoutes from './docs';
import rootRoutes from './root';

export default (app) => {
    // login and oauth routes
    app.use('/', rootRoutes());

    // documentation routes
    app.use('/docs', docsRoutes());

    // v1 API routes
    app.use('/v1', v1ApiRoutes());
}
