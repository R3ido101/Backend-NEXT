import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import File from '../../src/models/File';
import Pack from '../../src/models/Pack';
import PackFile from '../../src/models/PackFile';

describe('Model: PackFile', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given pack file', async () => {
            const file = await File.query().insert({
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const expectedOutput = {
                pack_id: pack.id,
                pack_directory_id: null,
                file_id: file.id,
                name: 'test.zip'
            };

            const created = await PackFile.query().insert({
                pack_id: pack.id,
                file_id: file.id,
                name: 'test.zip'
            });

            const packFile = await PackFile.query().findById(created.id);

            expect(packFile).toBeInstanceOf(Object);
            expect(packFile).toMatchObject(expectedOutput);
            expect(packFile).toHaveProperty('id');
            expect(packFile).toHaveProperty('created_at');
        });

        it('should return undefined if a pack file cannot be found by id', async () => {
            const packFile = await PackFile.query().findById(1);

            expect(packFile).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a pack file', async () => {
            const file = await File.query().insert({
                hash: 'cf80cd8aed482d5d1527d7dc72fceff84e6326592848447d2dc0b0e87dfc9a90',
                size: 22
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const expectedOutput = {
                pack_id: pack.id,
                pack_directory_id: null,
                file_id: file.id,
                name: 'test.zip'
            };

            const packFile = await PackFile.query().insert({
                pack_id: pack.id,
                file_id: file.id,
                name: 'test.zip'
            });

            expect(packFile).toBeInstanceOf(Object);
            expect(packFile).toMatchObject(expectedOutput);
            expect(packFile).toHaveProperty('id');
            expect(packFile).toHaveProperty('created_at');
        });
    });
});