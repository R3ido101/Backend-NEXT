import passport from 'passport';
import { Router } from 'express';

import AuthController from '../controllers/AuthController';

export default () => {
    const routes = Router();

    routes.get('/login', AuthController.login);
    routes.post('/login', passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login', failureFlash: true}));
    routes.get('/logout', AuthController.logout);

    return routes;
}