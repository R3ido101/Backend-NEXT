import bcrypt from 'bcryptjs';
import passport from 'passport';
import { isFuture, parse } from 'date-fns';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import AnonymousStrategy from 'passport-anonymous';
import ClientPasswordStrategy from 'passport-oauth2-client-password';

import User from './models/User';
import APIError from './errors/APIError';
import OAuthClient from './models/oauth/OAuthClient';
import OAuthAccessToken from './models/oauth/OAuthAccessToken';

passport.use(new AnonymousStrategy());

passport.use(new LocalStrategy(async function (username, password, done) {
    const user = await User.query().where({username}).first();

    if (!user) {
        return done(null, false);
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false);
    }

    return done(null, user);
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.query().findById(id);

        if (!user) {
            return done(new APIError('Error finding user.'));
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

passport.use(new ClientPasswordStrategy(async function (clientId, clientSecret, done) {
    try {
        const client = await OAuthClient.query().where({client_id: clientId, client_secret: clientSecret}).first();

        if (!client) {
            return done(null, false);
        }

        return done(null, client);
    } catch (err) {
        return done(err);
    }
}));

passport.use(new BearerStrategy(async function (accessToken, done) {
    try {
        const token = await OAuthAccessToken.query().where({access_token: accessToken}).first();

        if (!token) {
            return done(null, false);
        }

        const expiresAt = parse(token.expires_at);

        if (token.revoked || !isFuture(expiresAt)) {
            await OAuthAccessToken.query().deleteById(token.id);
            return done(null, false);
        }

        const user = await User.query().findById(token.user_id).eager('roles');

        if (!user) {
            return done(null, false);
        }

        return done(null, user, {token});
    } catch (err) {
        return done(err);
    }
}));