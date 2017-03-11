import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import PackLeaderboard from '../../src/models/PackLeaderboard';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackLeaderboard', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack leaderboard', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: pack.id,
                pack_version_id: packVersion.id,
                username: 'test',
                time_played: 44
            });

            expect(packLeaderboard).to.be.an('object');

            expect(packLeaderboard).to.have.property('id').that.is.a('string');

            expect(packLeaderboard).to.have.property('pack_id').that.is.a('string');
            expect(packLeaderboard).to.have.property('pack_id').that.equals(pack.id);

            expect(packLeaderboard).to.have.property('pack_version_id').that.is.a('string');
            expect(packLeaderboard).to.have.property('pack_version_id').that.equals(packVersion.id);

            expect(packLeaderboard).to.have.property('username').that.is.a('string');
            expect(packLeaderboard).to.have.property('username').that.equals('test');

            expect(packLeaderboard).to.have.property('time_played').that.is.a('number');
            expect(packLeaderboard).to.have.property('time_played').that.equals(44);
        });
    });

    describe('pack', function () {
        it('should return the pack for a pack leaderboard', async function () {
            const createdPack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: createdPack.id
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: createdPack.id,
                pack_version_id: packVersion.id,
                username: 'test',
                time_played: 44
            });

            const pack = await packLeaderboard.$relatedQuery('pack');

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.is.a('string');

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });
    });

    describe('packVersion', function () {
        it('should return the pack version for a pack leaderboard', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const createdPackVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: pack.id,
                pack_version_id: createdPackVersion.id,
                username: 'test',
                time_played: 44
            });

            const packVersion = await packLeaderboard.$relatedQuery('packVersion');

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('id').that.is.a('string');

            expect(packVersion).to.have.property('version').that.equals('1.2.3');
        });
    });
});