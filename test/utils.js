import Faker from 'faker';
import { randexp } from 'randexp';

import { generateUID, getSafeString } from '../src/utils';

import Pack from '../src/models/Pack';
import Role from '../src/models/Role';
import User from '../src/models/User';

import OAuthScope from '../src/models/oauth/OAuthScope';
import OAuthClient from '../src/models/oauth/OAuthClient';
import OAuthAccessToken from '../src/models/oauth/OAuthAccessToken';

/**
 * Creates a Pack for testing.
 *
 * @param {object} [overrides={}]
 * @returns {Pack}
 */
export async function createPack(overrides = {}) {
    const packName = Faker.random.words(2);
    const safeName = getSafeString(packName);

    const defaults = {
        name: packName,
        safe_name: safeName,
    };

    return await Pack.query().insert({
        ...defaults,
        ...overrides,
    });
}

/**
 * Creates a User for testing.
 *
 * @param {object} [overrides={}]
 * @returns {User}
 */
export async function createUser(overrides = {}) {
    const defaults = {
        username: randexp('[A-Za-z0-9-_]{6,16}'),
        password: Faker.internet.password(),
        email: Faker.internet.email(),
    };

    return await User.query().insert({
        ...defaults,
        ...overrides,
    });
}

/**
 * Creates a Role for testing.
 *
 * @param {object} [overrides={}]
 * @returns {Role}
 */
export async function createRole(overrides = {}) {
    const defaults = {
        name: Faker.random.words(2),
        description: Faker.random.words(10),
    };

    return await Role.query().insert({
        ...defaults,
        ...overrides,
    });
}

/**
 * Creates a Scope for testing.
 *
 * @param {object} [overrides={}]
 * @returns {Scope}
 */
export async function createScope(overrides = {}) {
    const defaults = {
        name: Faker.random.word(),
        description: Faker.random.words(10),
    };

    return await OAuthScope.query().insert({
        ...defaults,
        ...overrides,
    });
}

/**
 * Adds the given Role to the given User.
 *
 * @param {Role} role
 * @param {User} user
 * @returns {UserRole}
 */
export async function addRoleToUser(role, user) {
    return await user.$relatedQuery('roles').relate({
        id: role.id,
    });
}

/**
 * Creates an OAuth Client for testing.
 *
 * @param {object} [overrides={}]
 * @returns {OAuthClient}
 */
export async function createOAuthClient(overrides = {}) {
    const userId = overrides.user_id || (await createUser()).id;

    const defaults = {
        name: Faker.random.words(2),
        client_id: generateUID(60),
        client_secret: generateUID(60),
        redirect_uri: Faker.internet.url(),
    };

    return await OAuthClient.query().insert({
        ...defaults,
        ...overrides,
        user_id: userId,
    });
}

/**
 * Creates an OAuth Access Token for testing.
 *
 * @param {object} [overrides={}]
 * @returns {OAuthAccessToken}
 */
export async function createAccessToken(overrides = {}) {
    const userId = overrides.user_id || (await createUser()).id;
    const clientId = overrides.client_id || (await createOAuthClient()).id;

    const defaults = {
        access_token: generateUID(60),
        expires_at: Faker.date.future(),
    };

    return await OAuthAccessToken.query().insert({
        ...defaults,
        ...overrides,
        user_id: userId,
        client_id: clientId,
    });
}
