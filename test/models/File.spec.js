import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import File from '../../src/models/File';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: File', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given file', async () => {
            const expectedOutput = {
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22,
                mod_id: null,
                mod_version_id: null
            };

            const created = await File.query().insert({
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22
            });

            const packFile = await File.query().findById(created.id);

            expect(packFile).toBeInstanceOf(Object);
            expect(packFile).toMatchObject(expectedOutput);
            expect(packFile).toHaveProperty('id');
            expect(packFile).toHaveProperty('created_at');
        });

        it('should return undefined if a file cannot be found by id', async () => {
            const file = await File.query().findById(1);

            expect(file).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a file', async () => {
            const expectedOutput = {
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22,
                mod_id: null,
                mod_version_id: null
            };

            const file = await File.query().insert({
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22
            });

            expect(file).toBeInstanceOf(Object);
            expect(file).toMatchObject(expectedOutput);
            expect(file).toHaveProperty('id');
            expect(file).toHaveProperty('created_at');
        });
    });
});