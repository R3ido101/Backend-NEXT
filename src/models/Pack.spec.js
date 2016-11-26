import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from './Pack';
import User from './User';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Pack', function () {
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
        it('should return the data for the given pack', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const pack = await Pack.query().findById(1);

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.is.a('number');
            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.is.a('string');
            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.is.a('string');
            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.is.a('string');
            expect(pack).to.have.property('description').that.equals('This is a test pack');

            expect(pack).to.have.property('type').that.is.a('string');
            expect(pack).to.have.property('type').that.equals('public');

            expect(pack).to.have.property('enabled').that.is.a('boolean');
            expect(pack).to.have.property('enabled').that.equals(true);

            expect(pack).to.have.property('created_at').that.is.a('string');
            expect(pack).to.have.property('updated_at').that.is.null;
            expect(pack).to.have.property('disabled_at').that.is.null;
        });

        it('should return undefined if a pack cannot be found by id', async function () {
            const pack = await Pack.query().findById(1);

            expect(pack).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.is.a('number');
            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.is.a('string');
            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.is.a('string');
            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.is.a('string');
            expect(pack).to.have.property('description').that.equals('This is a test pack');

            expect(pack).to.have.property('type').that.is.a('string');
            expect(pack).to.have.property('type').that.equals('public');

            expect(pack).to.have.property('enabled').that.is.a('boolean');
            expect(pack).to.have.property('enabled').that.equals(true);

            expect(pack).to.have.property('created_at').that.is.a('string');

            expect(pack).to.have.property('updated_at').that.is.null;

            expect(pack).to.have.property('disabled_at').that.is.null;
        });
    });

    describe('users', function () {
        it('should create a user for a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('users').insert({
                username: 'testuser',
                password: 'password',
                email: 'test@example.com'
            });

            const packUsers = await pack.$relatedQuery('users');

            expect(packUsers).to.be.an('array').with.length(1);

            const user = packUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('testuser');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });

        it('should attach a user to a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await User.query().insert({
                username: 'testuser',
                password: 'test',
                email: 'test@example.com'
            });

            await pack.$relatedQuery('users').relate(1);

            const packUsers = await pack.$relatedQuery('users');

            expect(packUsers).to.be.an('array').with.length(1);

            const user = packUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('testuser');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});