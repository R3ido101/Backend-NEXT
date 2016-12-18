import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../db';

import Mod from '../../src/models/Mod';
import ModVersion from '../../src/models/ModVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: ModVersion', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given mod version', async function () {
            const expectedOutput = {
                id: 1,
                mod_id: 1,
                version: '1.2.3'
            };

            await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod'
            });

            await ModVersion.query().insert({
                mod_id: 1,
                version: '1.2.3'
            });

            const modVersion = await ModVersion.query().findById(1);

            expect(modVersion).to.be.an('object');
            expect(modVersion).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(modVersion).to.contain.all.keys(['created_at']); // things that return but are variable
        });

        it('should return undefined if a mod cannot be found by id', async function () {
            const modVersion = await ModVersion.query().findById(1);

            expect(modVersion).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a mod version', async function () {
            const expectedOutput = {
                id: 1,
                mod_id: 1,
                version: '1.2.3'
            };

            await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod'
            });

            const modVersion = await ModVersion.query().insert({
                mod_id: 1,
                version: '1.2.3'
            });

            expect(modVersion).to.be.an('object');
            expect(modVersion).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(modVersion).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });
});