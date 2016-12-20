import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import Server from '../../src/models/Server';
import PackVersion from '../../src/models/PackVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Server', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given server', async function () {
            const expectedOutput = {
                id: 1,
                name: 'Test Server',
                host: '127.0.0.1',
                port: 25565,
                description: 'This is a test pack and it is for a test pack',
                pack_id: 1,
                pack_version_id: 1,
                banner_url: null,
                website_url: null,
                discord_invite_code: null,
                votifier_host: null,
                votifier_port: null,
                updated_at: null
            };

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            await Server.query().insert({
                name: 'Test Server',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: 1,
                pack_version_id: 1
            });

            const server = await Server.query().findById(1);

            expect(server).to.be.an('object');
            expect(server).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(server).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });

    describe('insert', function () {
        it('should create a server', async function () {
            const expectedOutput = {
                id: 1,
                name: 'Test Server',
                host: '127.0.0.1',
                port: 25565,
                description: 'This is a test pack and it is for a test pack',
                pack_id: 1,
                pack_version_id: 1,
                banner_url: null,
                website_url: null,
                discord_invite_code: null,
                votifier_host: null,
                votifier_port: null,
                updated_at: null
            };

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            const server = await Server.query().insert({
                name: 'Test Server',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: 1,
                pack_version_id: 1
            });

            expect(server).to.be.an('object');
            expect(server).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(server).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });
});