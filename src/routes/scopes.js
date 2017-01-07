import { Router } from 'express';

import ScopesController from '../controllers/ScopesController';

export default () => {
    const routes = Router();

    routes.get('/', ScopesController.index);

    return routes;
}