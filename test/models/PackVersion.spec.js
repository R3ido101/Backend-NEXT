import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import MinecraftVersion from '../../src/models/MinecraftVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackVersion', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack version', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const packVersion = await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: 1
            });

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('id').that.is.a('number');
            expect(packVersion).to.have.property('id').that.equals(1);

            expect(packVersion).to.have.property('pack_id').that.is.a('number');
            expect(packVersion).to.have.property('pack_id').that.equals(1);

            expect(packVersion).to.have.property('minecraft_version_id').that.is.null;

            expect(packVersion).to.have.property('published_revision_id').that.is.null;

            expect(packVersion).to.have.property('version').that.is.a('string');
            expect(packVersion).to.have.property('version').that.equals('test');

            expect(packVersion).to.have.property('changelog').that.is.a('string');
            expect(packVersion).to.have.property('changelog').that.equals('test');

            expect(packVersion).to.have.property('created_at').that.is.a('string');

            expect(packVersion).to.have.property('updated_at').that.is.null;

            expect(packVersion).to.have.property('published_at').that.is.null;
        });
    });

    describe('minecraftVersion', function () {
        it('should get the Minecraft version for a pack version', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await MinecraftVersion.query().insert({
                version: '1.2.3'
            });

            const packVersion = await PackVersion.query().insert({
                version: 'test',
                minecraft_version_id: 1,
                changelog: ' test',
                pack_id: 1
            });

            const minecraftVersions = await packVersion.$relatedQuery('minecraftVersion');

            expect(minecraftVersions).to.be.an('array').with.length(1);

            const minecraftVersion = minecraftVersions[0];

            expect(minecraftVersion).to.be.an('object');

            expect(minecraftVersion).to.have.property('version').that.equals('1.2.3');
        });
    });
});