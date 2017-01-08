import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import User from '../../src/models/User';
import Server from '../../src/models/Server';
import PackVersion from '../../src/models/PackVersion';
import ServerFeaturedHistory from '../../src/models/ServerFeaturedHistory';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: ServerFeaturedHistory', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given server feature history', async function () {
            const user = await User.query().insert({
                username: 'Test',
                email: 'test@example.com',
                password: 'test'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerFeaturedHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14
            };

            const serverFeaturedHistory = await ServerFeaturedHistory.query().insert({
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14,
                expires_at: new Date().toJSON()
            });

            const serverHistory = await ServerFeaturedHistory.query().findById(serverFeaturedHistory.id);

            expect(serverHistory).to.be.an('object');
            expect(serverHistory).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(serverHistory).to.contain.all.keys(['id', 'created_at', 'expires_at']); // things that return but are variable
        });
    });

    describe('insert', function () {
        it('should create a server feature history', async function () {
            const user = await User.query().insert({
                username: 'Test',
                email: 'test@example.com',
                password: 'test'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerFeaturedHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14
            };

            const serverHistory = await ServerFeaturedHistory.query().insert({
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14,
                expires_at: new Date().toJSON()
            });

            expect(serverHistory).to.be.an('object');
            expect(serverHistory).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(serverHistory).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });
});