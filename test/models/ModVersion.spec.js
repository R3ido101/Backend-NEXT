import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Mod from '../../src/models/Mod';
import ModVersion from '../../src/models/ModVersion';

describe('Model: ModVersion', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given mod version', async () => {
            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2']
            });

            const expectedOutput = {
                mod_id: mod.id,
                version: '1.2.3',
                changelog: 'Test'
            };

            const created = await ModVersion.query().insert({
                mod_id: mod.id,
                version: '1.2.3',
                changelog: 'Test'
            });

            const modVersion = await ModVersion.query().findById(created.id);

            expect(modVersion).toBeInstanceOf(Object);
            expect(modVersion).toMatchObject(expectedOutput);
            expect(modVersion).toHaveProperty('id');
            expect(modVersion).toHaveProperty('created_at');
        });

        it('should return undefined if a mod cannot be found by id', async () => {
            const modVersion = await ModVersion.query().findById(1);

            expect(modVersion).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a mod version', async () => {
            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2']
            });
            const expectedOutput = {
                mod_id: mod.id,
                version: '1.2.3',
                changelog: 'Test',
                java_versions: [
                    '1.7',
                    '1.8'
                ]
            };

            const modVersion = await ModVersion.query().insert({
                mod_id: mod.id,
                version: '1.2.3',
                changelog: 'Test',
                java_versions: [
                    '1.7',
                    '1.8'
                ]
            });

            expect(modVersion).toBeInstanceOf(Object);
            expect(modVersion).toMatchObject(expectedOutput);
            expect(modVersion).toHaveProperty('id');
            expect(modVersion).toHaveProperty('created_at');
        });
    });
});