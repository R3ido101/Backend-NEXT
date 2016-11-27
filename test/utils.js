import Faker from 'faker';

import { generateUID } from '../src/utils';

import Pack from '../src/models/Pack';
import Role from '../src/models/Role';
import User from '../src/models/User';
import OAuthScope from './src/models/oauth/OAuthScope';
import OAuthClient from './src/models/oauth/OAuthClient';
import OAuthAccessToken from './src/models/oauth/OAuthAccessToken';

import { getSafeString } from '../src/utils';

export async function createUserWithPack(userOverrides = {}, packOverrides = {}, overrides = {}) {
    const user = createUser(userOverrides);
    const pack = createPack(packOverrides);

    const createdById = overrides.created_by || createUser().id;

    const defaults = {
        user_id: user.id,
        pack_id: pack.id,
        created_by: createdById
    };

    return await Pack.$relatedQuery('users').insert({
        ...defaults,
        ...overrides
    });
}

export async function createPack(overrides = {}) {
    const createdById = overrides.created_by || (await createUser()).id;

    const packName = Faker.random.words(2);
    const safeName = getSafeString(packName);

    const defaults = {
        name: packName,
        safe_name: safeName,
        position: Faker.random.number({min: 1, max: 500}),
        type: Faker.random.arrayElement(['public', 'semipublic', 'private']),
        enabled: Faker.random.boolean(),
        can_publish: Faker.random.boolean(),
        created_by: createdById
    };

    return await Pack.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createUser(overrides = {}) {
    const defaults = {
        username: Faker.internet.userName(),
        password: Faker.internet.password(),
        email: Faker.internet.email()
    };

    return await User.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createRole(overrides = {}) {
    const createdById = overrides.created_by || (await createUser()).id;

    const defaults = {
        name: Faker.random.word(),
        description: Faker.random.words(10),
        created_by: createdById
    };

    return await Role.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createUserWithRole(userOverrides = {}, roleOverrides = {}, overrides = {}) {
    const user = createUser(userOverrides);
    const role = createRole(roleOverrides);

    const createdById = overrides.created_by || createUser().id;

    const defaults = {
        user_id: user.id,
        role_id: role.id,
        created_by: createdById
    };

    return await Role.$relatedQuery('users').insert({
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
        id: role.id,
        created_by: user.id
    });
}

export async function createAccessToken(overrides = {}) {
    const defaults = {
        access_token: generateUID(128),
        expires_at: Faker.date.future()
    };

    return await OAuthAccessToken.query().insert({
        ...defaults,
        ...overrides
    });
}

export async function createOAuthClient(overrides = {}) {
    const defaults = {
        name: Faker.random.word(),
        client_id: generateUID(128),
        client_secret: generateUID(128),
        redirect_uri: Faker.internet.url()
    };

    return await OAuthClient.query().insert({
        ...defaults,
        ...overrides
    });
}