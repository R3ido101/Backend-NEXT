import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Mod from '../../src/models/Mod';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Mod', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given mod', async function () {
            const expectedOutput = {
                id: 1,
                name: 'Test Mod',
                description: 'This is a test mod',
                website_url: null,
                donation_url: null,
                updated_at: null
            };

            await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod'
            });

            const mod = await Mod.query().findById(1);

            expect(mod).to.be.an('object');
            expect(mod).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(mod).to.contain.all.keys(['created_at']); // things that return but are variable
        });

        it('should return undefined if a mod cannot be found by id', async function () {
            const mod = await Mod.query().findById(1);

            expect(mod).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a mod', async function () {
            const expectedOutput = {
                id: 1,
                name: 'Test Mod',
                description: 'This is a test mod',
                website_url: null,
                donation_url: null,
                updated_at: null
            };

            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod'
            });

            expect(mod).to.be.an('object');
            expect(mod).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(mod).to.contain.all.keys(['created_at']); // things that return but are variable
        });
    });

    describe('versions', function () {
        it('should attach a mod version to a mod', async function () {
            const mod = await Mod.query().insert({
                name: 'Test Mod',
                description: 'This is a test mod',
            });

            await mod.$relatedQuery('versions').insert({
                version: '1.2.3'
            });

            const versions = await mod.$relatedQuery('versions');

            expect(versions).to.be.an('array').with.length(1);

            const modVersion = versions[0];

            expect(modVersion).to.be.an('object');

            expect(modVersion).to.have.property('version').that.equals('1.2.3');

            expect(modVersion).to.have.property('mod_id').that.equals(1);
        });
    });
});