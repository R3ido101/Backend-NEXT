import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import Role from '../../src/models/Role';
import User from '../../src/models/User';

describe('Model: User', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given user', async () => {
            const expectedOutput = {
                username: 'test',
                email: 'test@example.com',
                must_change_password: false,
                is_banned: false,
                ban_reason: null,
                is_verified: false,
                tfa_secret: null,
                updated_at: null,
                verified_at: null,
                banned_at: null
            };

            const created = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            const user = await User.query().findById(created.id);

            expect(user).toBeInstanceOf(Object);
            expect(user).toMatchObject(expectedOutput);
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('password');
            expect(user).toHaveProperty('verification_code');
            expect(user).toHaveProperty('created_at');
        });

        it('should return undefined if a user cannot be found by id', async () => {
            const user = await User.query().findById(1);

            expect(user).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a user', async () => {
            const expectedOutput = {
                username: 'test',
                email: 'test@example.com',
                must_change_password: false,
                is_banned: false,
                ban_reason: null,
                is_verified: false,
                tfa_secret: null,
                updated_at: null,
                verified_at: null,
                banned_at: null
            };

            const user = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            expect(user).toBeInstanceOf(Object);
            expect(user).toMatchObject(expectedOutput);
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('password');
            expect(user).toHaveProperty('verification_code');
            expect(user).toHaveProperty('created_at');
        });

        it('should throw an error if email is invalid format', () => {
            const input = {
                username: 'test',
                password: 'test',
                email: 'error'
            };

            const expectedError = new Error({
                email: [
                    {
                        message: 'should match format "email"',
                        keyword: 'format',
                        params: {
                            format: 'email'
                        }
                    }
                ]
            });

            return expect(User.query().insert(input)).rejects.toMatchObject(expectedError);
        });

        it('should throw an error if username is invalid format', () => {
            const input = {
                username: 'a',
                password: 'test',
                email: 'test@example.com'
            };

            const expectedError = new Error({
                username: [
                    {
                        message: 'should NOT be shorter than 3 characters',
                        keyword: 'minLength',
                        params: {
                            limit: 3
                        }
                    }
                ]
            });

            return expect(User.query().insert(input)).rejects.toMatchObject(expectedError);
        });
    });

    describe('roles', () => {
        it('should create a role for a user', async () => {
            const user = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            await user.$relatedQuery('roles').insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            const usersRoles = await user.$relatedQuery('roles');

            expect(usersRoles).toBeInstanceOf(Array);
            expect(usersRoles).toHaveLength(1);

            const role = usersRoles[0];

            expect(role).toBeInstanceOf(Object);
            expect(role).toHaveProperty('name', 'testrole');
            expect(role).toHaveProperty('description', 'This is a test role');
        });

        it('should attach a role to a user', async () => {
            const user = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            const created = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            await user.$relatedQuery('roles').relate(created.id);

            const usersRoles = await user.$relatedQuery('roles');

            expect(usersRoles).toBeInstanceOf(Array);
            expect(usersRoles).toHaveLength(1);

            const role = usersRoles[0];

            expect(role).toBeInstanceOf(Object);
            expect(role).toHaveProperty('name', 'testrole');
            expect(role).toHaveProperty('description', 'This is a test role');
        });
    });

    describe('packs', () => {
        it('should create a pack for a user', async () => {
            const user = await User.query().insert({
                username: 'testuser',
                password: 'password',
                email: 'test@example.com'
            });

            await user.$relatedQuery('packs').insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const usersPacks = await user.$relatedQuery('packs');

            expect(usersPacks).toBeInstanceOf(Array);
            expect(usersPacks).toHaveLength(1);

            const pack = usersPacks[0];

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toHaveProperty('name', 'Test Pack');
            expect(pack).toHaveProperty('safe_name', 'TestPack');
            expect(pack).toHaveProperty('description', 'This is a test pack');
        });

        it('should attach a pack to a user', async () => {
            const user = await User.query().insert({
                username: 'testuser',
                password: 'test',
                email: 'test@example.com'
            });

            const created = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await user.$relatedQuery('packs').relate(created.id);

            const usersPacks = await user.$relatedQuery('packs');

            expect(usersPacks).toBeInstanceOf(Array);
            expect(usersPacks).toHaveLength(1);

            const pack = usersPacks[0];

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toHaveProperty('name', 'Test Pack');
            expect(pack).toHaveProperty('safe_name', 'TestPack');
            expect(pack).toHaveProperty('description', 'This is a test pack');
        });
    });
});