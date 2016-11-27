import passport from 'passport';
import oauth2orize from 'oauth2orize';
import login from 'connect-ensure-login';
import { isFuture, parse } from 'date-fns';

import { getConfig } from '../config';
import { addTimeStringToDate, generateUID } from './utils';

import APIError from './errors/APIError';
import OAuthScope from './models/oauth/OAuthScope';
import OAuthClient from './models/oauth/OAuthClient';
import OAuthAccessToken from './models/oauth/OAuthAccessToken';
import OAuthRefreshToken from './models/oauth/OAuthRefreshToken';
import OAuthAuthorizationCode from './models/oauth/OAuthAuthorizationCode';

const config = getConfig();
const server = oauth2orize.createServer();

server.serializeClient(function (client, done) {
    return done(null, client.client_id);
});

server.deserializeClient(async function (id, done) {
    try {
        const client = await OAuthClient.query().where({client_id: id}).first();

        if (!client) {
            return done(new APIError('Client not found.'));
        }

        return done(null, client);
    } catch (err) {
        return done(err);
    }
});

server.grant(oauth2orize.grant.code({scopeSeparator: ','}, async function (client, redirectURI, user, ares, done) {
    const code = {
        authorization_code: generateUID(),
        client_id: client.id,
        user_id: user.id,
        redirect_uri: redirectURI,
        scope: ares.scope,
        expires_at: addTimeStringToDate(config.oauth.validity.authorization_code)
    };

    try {
        const authorizationCode = await OAuthAuthorizationCode.query().insert(code);

        if (!authorizationCode) {
            return done(new APIError('Error creating authorization code.'));
        }

        return done(null, code.authorization_code);
    } catch (err) {
        return done(err);
    }
}));

server.grant(oauth2orize.grant.token({scopeSeparator: ','}, async function (client, user, ares, done) {
    try {
        const accessToken = await OAuthAccessToken.query().insert({
            user_id: user.id,
            client_id: client.id,
            scope: ares.scope,
            access_token: generateUID(256),
            expires_at: addTimeStringToDate(config.oauth.validity.access_token)
        });

        if (!accessToken) {
            return done(new APIError('Error creating access token.'));
        }

        const refreshToken = await OAuthRefreshToken.query().insert({
            access_token_id: accessToken.id,
            refresh_token: generateUID(256),
            scope: accessToken.scope,
            expires_at: addTimeStringToDate(config.oauth.validity.refresh_token)
        });

        if (!refreshToken) {
            return done(new APIError('Error creating refresh token.'));
        }

        return done(null, accessToken.access_token, {
            scope: accessToken.scope,
            expires_at: accessToken.expires_at,
            refresh_token: refreshToken.refresh_token,
            refresh_token_expires_at: refreshToken.expires_at
        });
    } catch (err) {
        return done(err);
    }
}));

server.exchange(oauth2orize.exchange.clientCredentials({scopeSeparator: ','}, async function (client, scope, done) {
    try {
        if (!scope || !await OAuthScope.isValidScopes(scope)) {
            return done(new APIError('Invalid scope provided.'));
        }

        const accessToken = await OAuthAccessToken.query().insert({
            user_id: client.user_id,
            client_id: client.id,
            scope: scope.join(','),
            access_token: generateUID(256),
            expires_at: addTimeStringToDate(config.oauth.validity.access_token)
        });

        if (!accessToken) {
            return done(new APIError('Error creating access token.'));
        }

        const refreshToken = await OAuthRefreshToken.query().insert({
            access_token_id: accessToken.id,
            refresh_token: generateUID(256),
            scope: accessToken.scope,
            expires_at: addTimeStringToDate(config.oauth.validity.refresh_token)
        });

        if (!refreshToken) {
            return done(new APIError('Error creating refresh token.'));
        }

        return done(null, accessToken.access_token, refreshToken.refresh_token, {
            scope: accessToken.scope,
            expires_at: accessToken.expires_at,
            refresh_token_expires_at: refreshToken.expires_at
        });
    } catch (err) {
        return done(err);
    }
}));

server.exchange(oauth2orize.exchange.authorizationCode({scopeSeparator: ','}, async function (client, code, redirectURI, done) {
    try {
        const authorizationCode = await OAuthAuthorizationCode.query().where({authorization_code: code}).first();

        if (!authorizationCode) {
            return done(null, false);
        }

        if (client.id !== authorizationCode.client_id) {
            return done(null, false);
        }

        if (redirectURI !== authorizationCode.redirect_uri) {
            return done(null, false);
        }

        const expiresAt = parse(authorizationCode.expires_at);

        if (authorizationCode.revoked || !isFuture(expiresAt)) {
            await OAuthAuthorizationCode.query().deleteById(authorizationCode.id);
            return done(null, false);
        }

        await OAuthAuthorizationCode.query().deleteById(authorizationCode.id);

        const accessToken = await OAuthAccessToken.query().insert({
            user_id: authorizationCode.user_id,
            client_id: authorizationCode.client_id,
            scope: authorizationCode.scope,
            access_token: generateUID(256),
            expires_at: addTimeStringToDate(config.oauth.validity.access_token)
        });

        if (!accessToken) {
            return done(new APIError('Error creating access token.'));
        }

        const refreshToken = await OAuthRefreshToken.query().insert({
            access_token_id: accessToken.id,
            refresh_token: generateUID(256),
            scope: accessToken.scope,
            expires_at: addTimeStringToDate(config.oauth.validity.refresh_token)
        });

        if (!refreshToken) {
            return done(new APIError('Error creating refresh token.'));
        }

        return done(null, accessToken.access_token, refreshToken.refresh_token, {
            scope: accessToken.scope,
            expires_at: accessToken.expires_at,
            refresh_token_expires_at: refreshToken.expires_at
        });
    } catch (err) {
        return done(err);
    }
}));

server.exchange(oauth2orize.exchange.refreshToken({scopeSeparator: ','}, async function (client, code, scope, done) {
    try {
        if (!scope || !await OAuthScope.isValidScopes(scope)) {
            return done(new APIError('Invalid scope provided.'));
        }

        const oldRefreshToken = await OAuthRefreshToken.query().where({refresh_token: code}).first();

        if (!oldRefreshToken) {
            return done(new APIError('Invalid refresh token.'));
        }

        if (oldRefreshToken.scope !== scope.join(',')) {
            return done(new APIError('Scopes do not match original authorization.'));
        }

        const expiresAt = parse(oldRefreshToken.expires_at);

        if (oldRefreshToken.revoked) {
            await OAuthRefreshToken.query().deleteById(oldRefreshToken.id);
            return done(new APIError('Refresh token has been revoked.'));
        }

        if (!isFuture(expiresAt)) {
            await OAuthRefreshToken.query().deleteById(oldRefreshToken.id);
            return done(new APIError('Refresh token has expired.'));
        }

        const oldAccessToken = await OAuthAccessToken.query().where({id: oldRefreshToken.access_token_id}).first();

        await OAuthAccessToken.query().deleteById(oldAccessToken.id);
        await OAuthRefreshToken.query().deleteById(oldRefreshToken.id);

        const accessToken = await OAuthAccessToken.query().insert({
            user_id: oldAccessToken.user_id,
            client_id: oldAccessToken.client_id,
            scope: oldAccessToken.scope.join(','),
            access_token: generateUID(256),
            expires_at: addTimeStringToDate(config.oauth.validity.access_token)
        });

        if (!accessToken) {
            return done(new APIError('Error creating access token.'));
        }

        const refreshToken = await OAuthRefreshToken.query().insert({
            access_token_id: accessToken.id,
            refresh_token: generateUID(256),
            scope: accessToken.scope,
            expires_at: addTimeStringToDate(config.oauth.validity.refresh_token)
        });

        if (!refreshToken) {
            return done(new APIError('Error creating refresh token.'));
        }

        return done(null, accessToken.access_token, refreshToken.refresh_token, {
            scope: accessToken.scope,
            expires_at: accessToken.expires_at,
            refresh_token_expires_at: refreshToken.expires_at
        });
    } catch (err) {
        return done(err);
    }
}));

export const authorization = [
    login.ensureLoggedIn(),
    server.authorization(async function (clientID, redirectURI, done) {
        try {
            const client = await OAuthClient.query().where({
                client_id: clientID,
                redirect_uri: redirectURI
            }).first();

            if (!client) {
                return done(new APIError('Client not found.'));
            }

            return done(null, client, redirectURI);
        } catch (err) {
            return done(err);
        }
    }),
    async function (req, res, next) {
        const scope = req.oauth2.req.scope;

        if (!await OAuthScope.isValidScopes(scope)) {
            return next(new APIError('Invalid scope provided.'));
        }

        const scopes = await OAuthScope.query().whereIn('name', scope);

        return res.render('dialog', {
            transactionID: req.oauth2.transactionID,
            user: req.user,
            scopes,
            scopeString: scope.join(','),
            client: req.oauth2.client
        });
    }
];

export const decision = [
    login.ensureLoggedIn(),
    server.decision((req, done) => {
        done(null, {scope: req.body.scope});
    })
];

export const token = [
    passport.authenticate(['oauth2-client-password'], {session: false}),
    server.token(),
    server.errorHandler()
];

export default server;