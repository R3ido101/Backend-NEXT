import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Mod from '../../src/models/Mod';

describe('Model: Mod', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given mod', async () => {
            const expectedOutput = {
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2'],
                website_url: null,
                donation_url: null,
                updated_at: null
            };

            const created = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2']
            });

            const mod = await Mod.query().findById(created.id);

            expect(mod).toBeInstanceOf(Object);
            expect(mod).toMatchObject(expectedOutput);
            expect(mod).toHaveProperty('id');
            expect(mod).toHaveProperty('created_at');
        });

        it('should return undefined if a mod cannot be found by id', async () => {
            const mod = await Mod.query().findById(1);

            expect(mod).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a mod', async () => {
            const expectedOutput = {
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2'],
                website_url: null,
                donation_url: null,
                updated_at: null
            };

            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2']
            });

            expect(mod).toBeInstanceOf(Object);
            expect(mod).toMatchObject(expectedOutput);
            expect(mod).toHaveProperty('id');
            expect(mod).toHaveProperty('created_at');
        });
    });

    describe('versions', () => {
        it('should attach a mod version to a mod', async () => {
            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
                authors: ['test1', 'test2']
            });

            await mod.$relatedQuery('versions').insert({
                version: '1.2.3',
                changelog: 'Test'
            });

            const versions = await mod.$relatedQuery('versions');

            expect(versions).toBeInstanceOf(Array);
            expect(versions).toHaveLength(1);

            const modVersion = versions[0];

            expect(modVersion).toBeInstanceOf(Object);
            expect(modVersion).toHaveProperty('version', '1.2.3');
            expect(modVersion).toHaveProperty('changelog', 'Test');
            expect(modVersion).toHaveProperty('mod_id', mod.id);
        });
    });
});