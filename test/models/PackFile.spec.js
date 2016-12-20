import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import File from '../../src/models/File';
import Pack from '../../src/models/Pack';
import PackFile from '../../src/models/PackFile';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackFile', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given pack file', async function () {
            const expectedOutput = {
                id: 1,
                pack_id: 1,
                pack_directory_id: null,
                file_id: 1
            };

            await File.query().insert({
                name: 'test.zip',
                hash: 'dc724af18fbdd4e59189f5fe768a5f8311527050',
                size: 22
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackFile.query().insert({
                pack_id: 1,
                file_id: 1
            });

            const packFile = await PackFile.query().findById(1);

            expect(packFile).to.be.an('object');
            expect(packFile).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packFile).to.contain.all.keys(['created_at']); // things that return but are variable
        });

        it('should return undefined if a pack file cannot be found by id', async function () {
            const packFile = await PackFile.query().findById(1);

            expect(packFile).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a pack file', async function () {
            const expectedOutput = {
                id: 1,
                pack_id: 1,
                pack_directory_id: null,
                file_id: 1
            };

            await File.query().insert({
                name: 'test.zip',
                hash: 'dc724af18fbdd4e59189f5fe768a5f8311527050',
                size: 22
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const packFile = await PackFile.query().insert({
                pack_id: 1,
                file_id: 1
            });

            expect(packFile).to.be.an('object');
            expect(packFile).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packFile).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });
});