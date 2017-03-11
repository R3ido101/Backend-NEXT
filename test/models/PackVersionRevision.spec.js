import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import PackVersionRevision from '../../src/models/PackVersionRevision';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackVersionRevision', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack version revision', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: pack.id
            });

            const packVersionRevision = await PackVersionRevision.query().insert({
                json: '{"test": true}',
                pack_version_id: packVersion.id
            });

            expect(packVersionRevision).to.be.an('object');

            expect(packVersionRevision).to.have.property('id').that.is.a('string');

            expect(packVersionRevision).to.have.property('pack_version_id').that.is.a('string');
            expect(packVersionRevision).to.have.property('pack_version_id').that.equals(packVersion.id);

            expect(packVersionRevision).to.have.property('hash').that.is.a('string');
            expect(packVersionRevision).to.have.property('hash').that.equals('80f65706d935d3b928d95207937dd81bad43ab56cd4d3b7ed41772318e734168');

            expect(packVersionRevision).to.have.property('json').that.equals('{"test": true}');

            expect(packVersionRevision).to.have.property('is_verified').that.is.a('boolean');
            expect(packVersionRevision).to.have.property('is_verified').that.equals(false);

            expect(packVersionRevision).to.have.property('is_verifying').that.is.a('boolean');
            expect(packVersionRevision).to.have.property('is_verifying').that.equals(false);

            expect(packVersionRevision).to.have.property('created_at').that.is.a('string');

            expect(packVersionRevision).to.have.property('verified_at').that.is.null;
        });
    });

    describe('packVersion', function () {
        it('should get the Minecraft version for a pack version', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const createdPackVersion = await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: pack.id
            });

            const packVersionRevision = await PackVersionRevision.query().insert({
                json: '{"test": true}',
                pack_version_id: createdPackVersion.id
            });

            const packVersion = await packVersionRevision.$relatedQuery('packVersion');

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('version').that.equals('test');
            expect(packVersion).to.have.property('changelog').that.equals('test');
        });
    });
});