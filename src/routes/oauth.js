import { Router } from 'express';

import { authorization, decision, token } from '../oauth';

export default () => {
    const routes = Router();

    routes.get('/authorize', authorization);
    routes.post('/authorize', decision);
    routes.post('/token', token);

    return routes;
};
