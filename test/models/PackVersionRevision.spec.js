import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import PackVersionRevision from '../../src/models/PackVersionRevision';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackVersionRevision', function () {
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

    describe('insert', function () {
        it('should create a pack version revision', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: 1
            });

            const packVersionRevision = await PackVersionRevision.query().insert({
                json: '{"test": true}',
                pack_version_id: 1
            });

            expect(packVersionRevision).to.be.an('object');

            expect(packVersionRevision).to.have.property('id').that.is.a('number');
            expect(packVersionRevision).to.have.property('id').that.equals(1);

            expect(packVersionRevision).to.have.property('pack_version_id').that.is.a('number');
            expect(packVersionRevision).to.have.property('pack_version_id').that.equals(1);

            expect(packVersionRevision).to.have.property('hash').that.is.a('string');
            expect(packVersionRevision).to.have.property('hash').that.equals('b20c815bebe41c4773500b3b4688770672454b9b');

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
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: 1
            });

            const packVersionRevision = await PackVersionRevision.query().insert({
                json: '{"test": true}',
                pack_version_id: 1
            });

            const packVersions = await packVersionRevision.$relatedQuery('packVersion');

            expect(packVersions).to.be.an('array').with.length(1);

            const packVersion = packVersions[0];

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('version').that.equals('test');
            expect(packVersion).to.have.property('changelog').that.equals('test');
        });
    });
});