import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import File from '../../src/models/File';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: File', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given file', async function () {
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

            expect(packFile).to.be.an('object');
            expect(packFile).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packFile).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });

        it('should return undefined if a file cannot be found by id', async function () {
            const file = await File.query().findById(1);

            expect(file).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a file', async function () {
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

            expect(file).to.be.an('object');
            expect(file).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(file).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });
    });
});