import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../db';

import Pack from '../../src/models/Pack';
import PackStat from '../../src/models/PackStat';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackStat', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack stat', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const packStat = await PackStat.query().insert({
                date: '2016-07-07',
                pack_id: 1,
                pack_installs: 1234
            });

            expect(packStat).to.be.an('object');

            expect(packStat).to.have.property('id').that.is.a('number');
            expect(packStat).to.have.property('id').that.equals(1);

            expect(packStat).to.have.property('pack_id').that.is.a('number');
            expect(packStat).to.have.property('pack_id').that.equals(1);

            expect(packStat).to.have.property('date').that.is.a('string');
            expect(packStat).to.have.property('date').that.equals('2016-07-07');

            expect(packStat).to.have.property('pack_installs').that.is.a('number');
            expect(packStat).to.have.property('pack_installs').that.equals(1234);

            expect(packStat).to.have.property('pack_updates').that.is.a('number');
            expect(packStat).to.have.property('pack_updates').that.equals(0);

            expect(packStat).to.have.property('server_installs').that.is.a('number');
            expect(packStat).to.have.property('server_installs').that.equals(0);

            expect(packStat).to.have.property('server_updates').that.is.a('number');
            expect(packStat).to.have.property('server_updates').that.equals(0);

            expect(packStat).to.have.property('time_played').that.is.a('number');
            expect(packStat).to.have.property('time_played').that.equals(0);
        });
    });

    describe('pack', function () {
        it('should return the pack for a pack stat', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packStat = await PackStat.query().insert({
                pack_id: 1,
                date: '2016-07-07'
            });

            const packs = await packStat.$relatedQuery('pack');

            expect(packs).to.be.an('array').with.length(1);

            const pack = packs[0];

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });
    });
});