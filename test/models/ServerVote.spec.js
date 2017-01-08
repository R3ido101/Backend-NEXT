import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import Server from '../../src/models/Server';
import ServerVote from '../../src/models/ServerVote';
import PackVersion from '../../src/models/PackVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: ServerVote', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given server vote', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                username: 'Test'
            };

            const created = await ServerVote.query().insert({
                server_id: server.id,
                username: 'Test'
            });

            const serverVote = await ServerVote.query().findById(created.id);

            expect(serverVote).to.be.an('object');
            expect(serverVote).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(serverVote).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });

    describe('insert', function () {
        it('should create a server vote', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                username: 'Test'
            };

            const serverVote = await ServerVote.query().insert({
                server_id: server.id,
                username: 'Test'
            });

            expect(serverVote).to.be.an('object');
            expect(serverVote).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(serverVote).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });
});