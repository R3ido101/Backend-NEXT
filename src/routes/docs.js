import { Router } from 'express';

import DocsController from '../controllers/DocsController';

export default () => {
    const routes = Router();

    routes.get('/*', DocsController.render);

    return routes;
};
