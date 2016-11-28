import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from './Pack';
import PackVersion from './PackVersion';
import MinecraftVersion from './MinecraftVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: MinecraftVersion', function () {
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
        it('should create a Minecraft version', async function () {
            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.7.10'
            });

            expect(minecraftVersion).to.be.an('object');

            expect(minecraftVersion).to.have.property('id').that.is.a('number');
            expect(minecraftVersion).to.have.property('id').that.equals(1);

            expect(minecraftVersion).to.have.property('version').that.is.a('string');
            expect(minecraftVersion).to.have.property('version').that.equals('1.7.10');

            expect(minecraftVersion).to.have.property('json').that.is.null;

            expect(minecraftVersion).to.have.property('created_at').that.is.a('string');

            expect(minecraftVersion).to.have.property('updated_at').that.is.null;
        });
    });

    describe('packVersions', function () {
        it('should list the pack versions for a Minecraft version', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.2.3'
            });

            await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: 1,
                minecraft_version_id: 1
            });

            const packVersions = await minecraftVersion.$relatedQuery('packVersions');

            expect(packVersions).to.be.an('array').with.length(1);

            const packVersion = packVersions[0];

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('version').that.equals('test');

            expect(packVersion).to.have.property('changelog').that.equals('test');
        });
    });
});