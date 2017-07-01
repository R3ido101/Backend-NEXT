import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackStat from '../../src/models/PackStat';

describe('Model: PackStat', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', () => {
        it('should create a pack stat', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packStat = await PackStat.query().insert({
                date: '2016-07-07',
                pack_id: pack.id,
                pack_installs: 1234
            });

            expect(packStat).toBeInstanceOf(Object);
            expect(packStat).toHaveProperty('id');
            expect(packStat).toHaveProperty('pack_id', pack.id);
            expect(packStat).toHaveProperty('date', '2016-07-07');
            expect(packStat).toHaveProperty('pack_installs', 1234);
            expect(packStat).toHaveProperty('pack_updates', 0);
            expect(packStat).toHaveProperty('server_installs', 0);
            expect(packStat).toHaveProperty('server_updates', 0);
            expect(packStat).toHaveProperty('time_played', 0);
        });
    });

    describe('pack', () => {
        it('should return the pack for a pack stat', async () => {
            const createdPack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packStat = await PackStat.query().insert({
                pack_id: createdPack.id,
                date: '2016-07-07'
            });

            const pack = await packStat.$relatedQuery('pack');

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toHaveProperty('id');
            expect(pack).toHaveProperty('name', 'Test Pack');
            expect(pack).toHaveProperty('description', 'This is a test pack');
        });
    });
});