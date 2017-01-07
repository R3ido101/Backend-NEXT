import Faker from 'faker';
import { randexp } from 'randexp';

import { generateUID } from '../src/utils';

import Pack from '../src/models/Pack';
import Role from '../src/models/Role';
import User from '../src/models/User';


import OAuthScope from '../src/models/oauth/OAuthScope';
import OAuthClient from '../src/models/oauth/OAuthClient';
import OAuthAccessToken from '../src/models/oauth/OAuthAccessToken';

import { getSafeString } from '../src/utils';

export async function createPack(overrides = {}) {
    const packName = Faker.random.words(2);
    const safeName = getSafeString(packName);

    const defaults = {
        name: packName,
        safe_name: safeName,
        position: Faker.random.number({min: 1, max: 500}),
        is_disabled: Faker.random.boolean()
    };

    return await Pack.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createUser(overrides = {}) {
    const defaults = {
        username: randexp('[A-Za-z0-9-_]{6,16}'),
        password: Faker.internet.password(),
        email: Faker.internet.email()
    };

    return await User.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createRole(overrides = {}) {
    const defaults = {
        name: Faker.random.words(2),
        description: Faker.random.words(10)
    };

    return await Role.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createScope(overrides = {}) {
    const defaults = {
        name: Faker.random.word(),
        description: Faker.random.words(10)
    };

    return await OAuthScope.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function addRoleToUser(role, user) {
    return await user.$relatedQuery('roles').relate({
        id: role.id
    });
}

export async function createAccessToken(overrides = {}) {
    if (!overrides.user_id) {
        overrides.user_id = (await createUser()).id;
    }

    if (!overrides.client_id) {
        overrides.client_id = (await createOAuthClient()).id;
    }

    const defaults = {
        access_token: generateUID(60),
        expires_at: Faker.date.future()
    };

    return await OAuthAccessToken.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createOAuthClient(overrides = {}) {
    if (!overrides.user_id) {
        overrides.user_id = (await createUser()).id;
    }

    const defaults = {
        name: Faker.random.words(2),
        client_id: generateUID(60),
        client_secret: generateUID(60),
        redirect_uri: Faker.internet.url()
    };

    return await OAuthClient.query().insert({
        ...defaults,
        ...overrides
    });
}