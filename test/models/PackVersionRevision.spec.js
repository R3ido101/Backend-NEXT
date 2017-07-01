import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import PackVersionRevision from '../../src/models/PackVersionRevision';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackVersionRevision', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', () => {
        it('should create a pack version revision', async () => {
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

            expect(packVersionRevision).toBeInstanceOf(Object);
            expect(packVersionRevision).toHaveProperty('id');
            expect(packVersionRevision).toHaveProperty('pack_version_id', packVersion.id);
            expect(packVersionRevision).toHaveProperty('hash', '80f65706d935d3b928d95207937dd81bad43ab56cd4d3b7ed41772318e734168');
            expect(packVersionRevision).toHaveProperty('json', '{"test": true}');
            expect(packVersionRevision).toHaveProperty('is_verified', false);
            expect(packVersionRevision).toHaveProperty('is_verifying', false);
            expect(packVersionRevision).toHaveProperty('created_at');
            expect(packVersionRevision).toHaveProperty('verified_at', null);
        });
    });

    describe('packVersion', () => {
        it('should get the Minecraft version for a pack version', async () => {
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

            expect(packVersion).toBeInstanceOf(Object);
            expect(packVersion).toHaveProperty('version', 'test');
            expect(packVersion).toHaveProperty('changelog', 'test');
        });
    });
});