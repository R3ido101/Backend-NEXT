import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from './Pack';
import Role from './Role';
import User from './User';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: User', function () {
    before(() => {
        Model.knex(knex);
    });

    beforeEach(function (done) {
        knex.migrate.rollback().then(function () {
            knex.migrate.latest().then(() => done());
        });
    });

    afterEach(function (done) {
        knex.migrate.rollback().then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given user', async function () {
            await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            const user = await User.query().findById(1);

            expect(user).to.be.an('object');

            expect(user).to.have.property('id').that.is.a('number');
            expect(user).to.have.property('id').that.equals(1);

            expect(user).to.have.property('username').that.is.a('string');
            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.is.a('string');
            expect(user).to.have.property('email').that.equals('test@example.com');

            expect(user).to.have.property('must_change_password').that.is.a('boolean');
            expect(user).to.have.property('must_change_password').that.equals(false);

            expect(user).to.have.property('is_banned').that.is.a('boolean');
            expect(user).to.have.property('is_banned').that.equals(false);

            expect(user).to.have.property('ban_reason').that.is.null;

            expect(user).to.have.property('created_at').that.is.a('string');
            expect(user).to.have.property('updated_at').that.is.null;
        });

        it('should return undefined if a user cannot be found by id', async function () {
            const user = await User.query().findById(1);

            expect(user).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a user', async function () {
            const user = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            expect(user).to.be.an('object');

            expect(user).to.have.property('id').that.is.a('number');
            expect(user).to.have.property('id').that.equals(1);

            expect(user).to.have.property('username').that.is.a('string');
            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.is.a('string');
            expect(user).to.have.property('email').that.equals('test@example.com');

            expect(user).to.have.property('password').that.is.a('string');

            expect(user).to.have.property('must_change_password').that.is.a('boolean');
            expect(user).to.have.property('must_change_password').that.equals(false);

            expect(user).to.have.property('is_banned').that.is.a('boolean');
            expect(user).to.have.property('is_banned').that.equals(false);

            expect(user).to.have.property('ban_reason').that.is.null;

            expect(user).to.have.property('created_at').that.is.a('string');

            expect(user).to.have.property('updated_at').that.is.null;
        });

        it('should throw an error if email is invalid format', function () {
            const input = {
                username: 'test',
                password: 'test',
                email: 'error'
            };

            const expectedError = '"email": "should match format \\"email\\"';

            return expect(User.query().insert(input)).to.be.rejectedWith(expectedError);
        });

        it('should throw an error if username is invalid format', function () {
            const input = {
                username: 'a',
                password: 'test',
                email: 'test@example.com'
            };

            const expectedError = '"username": "should NOT be shorter than 3 characters"';

            return expect(User.query().insert(input)).to.be.rejectedWith(expectedError);
        });
    });

    describe('roles', function () {
        it('should create a role for a user', async function () {
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

            expect(usersRoles).to.be.an('array').with.length(1);

            const role = usersRoles[0];

            expect(role).to.be.an('object');

            expect(role).to.have.property('name').that.equals('testrole');

            expect(role).to.have.property('description').that.equals('This is a test role');
        });

        it('should attach a role to a user', async function () {
            const user = await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            await user.$relatedQuery('roles').relate(1);

            const usersRoles = await user.$relatedQuery('roles');

            expect(usersRoles).to.be.an('array').with.length(1);

            const role = usersRoles[0];

            expect(role).to.be.an('object');

            expect(role).to.have.property('name').that.equals('testrole');

            expect(role).to.have.property('description').that.equals('This is a test role');
        });
    });

    describe('packs', function () {
        it('should create a pack for a user', async function () {
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

            expect(usersPacks).to.be.an('array').with.length(1);

            const pack = usersPacks[0];

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });

        it('should attach a pack to a user', async function () {
            const user = await User.query().insert({
                username: 'testuser',
                password: 'test',
                email: 'test@example.com'
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await user.$relatedQuery('packs').relate(1);

            const usersPacks = await user.$relatedQuery('packs');

            expect(usersPacks).to.be.an('array').with.length(1);

            const pack = usersPacks[0];

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });
    });
});