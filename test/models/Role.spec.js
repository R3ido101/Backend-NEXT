import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Role from '../../src/models/Role';
import User from '../../src/models/User';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Role', function () {
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
        it('should return the data for the given role', async function () {
            await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            const role = await Role.query().findById(1);

            expect(role).to.be.an('object');

            expect(role).to.have.property('id').that.is.a('number');
            expect(role).to.have.property('id').that.equals(1);

            expect(role).to.have.property('name').that.is.a('string');
            expect(role).to.have.property('name').that.equals('testrole');

            expect(role).to.have.property('description').that.is.a('string');
            expect(role).to.have.property('description').that.equals('This is a test role');

            expect(role).to.have.property('created_at').that.is.a('string');

            expect(role).to.have.property('updated_at').that.is.null;
        });

        it('should return undefined if a role cannot be found by id', async function () {
            const pack = await Role.query().findById(1);

            expect(pack).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a role', async function () {
            const role = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            expect(role).to.be.an('object');

            expect(role).to.have.property('id').that.is.a('number');
            expect(role).to.have.property('id').that.equals(1);

            expect(role).to.have.property('name').that.is.a('string');
            expect(role).to.have.property('name').that.equals('testrole');

            expect(role).to.have.property('description').that.is.a('string');
            expect(role).to.have.property('description').that.equals('This is a test role');

            expect(role).to.have.property('created_at').that.is.a('string');

            expect(role).to.have.property('updated_at').that.is.null;
        });
    });

    describe('users', function () {
        it('should create a user for a role', async function () {
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

            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });

        it('should attach a user to a role', async function () {
            const role = await Role.query().insert({
                name: 'testrole',
                description: 'This is a test role'
            });

            await User.query().insert({
                username: 'test',
                password: 'test',
                email: 'test@example.com'
            });

            await role.$relatedQuery('users').relate(1);

            const roleUsers = await role.$relatedQuery('users');

            expect(roleUsers).to.be.an('array').with.length(1);

            const user = roleUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});