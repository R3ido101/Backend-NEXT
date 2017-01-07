import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackDirectory from '../../src/models/PackDirectory';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackDirectory', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given pack directory', async function () {
            const expectedOutput = {
                id: 1,
                name: 'test',
                pack_id: 1,
                parent: null,
                updated_at: null
            };

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await PackDirectory.query().insert({
                name: 'test',
                pack_id: 1
            });

            const packFile = await PackDirectory.query().findById(1);

            expect(packFile).to.be.an('object');
            expect(packFile).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packFile).to.contain.all.keys(['created_at']); // things that return but are variable
        });

        it('should return undefined if a pack directory cannot be found by id', async function () {
            const packDirectory = await PackDirectory.query().findById(1);

            expect(packDirectory).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a pack directory', async function () {
            const expectedOutput = {
                id: 1,
                name: 'test',
                pack_id: 1,
                parent: null,
                updated_at: null
            };

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packDirectory = await PackDirectory.query().insert({
                name: 'test',
                pack_id: 1
            });

            expect(packDirectory).to.be.an('object');
            expect(packDirectory).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packDirectory).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });
});