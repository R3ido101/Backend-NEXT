import { Router } from 'express';
import * as httpStatusCodes from 'http-status';

import APIError from '../errors/APIError';

/**
 * This checks to see if the user has the given role.
 *
 * @param {?object} [user]
 * @param {?string} [role]
 * @returns {boolean}
 */
function hasRole(user = null, role = null) {
    return user && role && user.hasRole(role);
}

/**
 * This checks to see if the token has the given scope.
 *
 * @param {?OAuthAccessToken} [token]
 * @param {?string} [scope]
 * @returns {boolean}
 */
function hasScope(token = null, scope = null) {
    return token && scope && token.hasScope(scope);
}

/**
 * This checks to make sure that the user has a given role.
 *
 * @param {?string} [role]
 * @returns {function}
 */
export function checkRole(role = null) {
    return (req, res, next) => {
        const user = req.user;

        if (!hasRole(user, role)) {
            return next(new APIError(
                `User doesn't have required role. '${role}' role is needed.`,
                httpStatusCodes.FORBIDDEN
            ));
        }

        return next();
    };
}

/**
 * This checks to make sure that the token has a given scope.
 *
 * @param {?string} [scope]
 * @returns {function}
 */
export function checkScope(scope = null) {
    return (req, res, next) => {
        const {token} = req.authInfo;

        if (!hasScope(token, scope)) {
            return next(new APIError(`Invalid scope on token. Scope '${scope}' is needed.`, httpStatusCodes.FORBIDDEN));
        }

        return next();
    };
}

/**
 * This middleware checks to see if the given user/token combination has the provided scope and/or role.
 *
 * @param {?string} [scope]
 * @param {?string} [role]
 * @returns {function}
 */
export function checkPermissions({scope = null, role = null}) {
    return (req, res, next) => {
        const user = req.user;
        const {token} = req.authInfo;

        if (scope && !hasScope(token, scope)) {
            return next(new APIError(
                `Invalid scope on token. Scope '${scope}' is needed.`,
                httpStatusCodes.FORBIDDEN
            ));
        }

        if (role && !hasRole(user, role)) {
            return next(new APIError(
                `User doesn't have required role. '${role}' role is needed.`,
                httpStatusCodes.FORBIDDEN
            ));
        }

        return next();
    };
}

export default () => {
    const middleware = Router();

    return middleware;
};
