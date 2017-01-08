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
describe('Model: MinecraftVersion', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a Minecraft version', async function () {
            const expectedOutput = {
                version: '1.7.10',
                json: null,
                updated_at: null
            };

            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.7.10'
            });

            expect(minecraftVersion).to.be.an('object');
            expect(minecraftVersion).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(minecraftVersion).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });

    describe('packVersions', function () {
        it('should list the pack versions for a Minecraft version', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.2.3'
            });

            await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: pack.id,
                minecraft_version_id: minecraftVersion.id
            });

            const expectedOutput = {
                version: 'test',
                changelog: 'test',
                pack_id: pack.id,
                minecraft_version_id: minecraftVersion.id,
                updated_at: null
            };

            const packVersions = await minecraftVersion.$relatedQuery('packVersions');

            expect(packVersions).to.be.an('array').with.length(1);

            const packVersion = packVersions[0];

            expect(packVersion).to.be.an('object');
            expect(packVersion).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packVersion).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });
});