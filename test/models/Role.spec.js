import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Role from '../../src/models/Role';
import User from '../../src/models/User';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Role', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given role', async function () {
            const expectedOutput = {
                name: 'testrole',
                description: 'This is a test role',
                updated_at: null
            };

            const created = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            const role = await Role.query().findById(created.id);

            expect(role).to.be.an('object');
            expect(role).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(role).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });

        it('should return undefined if a role cannot be found by id', async function () {
            const pack = await Role.query().findById(1);

            expect(pack).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a role', async function () {
            const expectedOutput = {
                name: 'testrole',
                description: 'This is a test role',
                updated_at: null
            };

            const role = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            expect(role).to.be.an('object');
            expect(role).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(role).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });

    describe('users', function () {
        it('should create a user for a role', async function () {
            const expectedOutput = {
                username: 'test',
                email: 'test@example.com'
            };

            const role = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            await role.$relatedQuery('users').insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            const roleUsers = await role.$relatedQuery('users');

            expect(roleUsers).to.be.an('array').with.length(1);

            const user = roleUsers[0];

            expect(user).to.be.an('object');
            expect(user).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
        });

        it('should attach a user to a role', async function () {
            const role = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            const createdUser = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            await role.$relatedQuery('users').relate(createdUser.id);

            const roleUsers = await role.$relatedQuery('users');

            expect(roleUsers).to.be.an('array').with.length(1);

            const user = roleUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});