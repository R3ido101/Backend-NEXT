import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import MinecraftVersion from '../../src/models/MinecraftVersion';

describe('Model: MinecraftVersion', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', () => {
        it('should create a Minecraft version', async () => {
            const expectedOutput = {
                version: '1.7.10',
                json: null,
                updated_at: null
            };

            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.7.10'
            });

            expect(minecraftVersion).toBeInstanceOf(Object);
            expect(minecraftVersion).toMatchObject(expectedOutput);
            expect(minecraftVersion).toHaveProperty('id');
            expect(minecraftVersion).toHaveProperty('created_at');
        });
    });

    describe('packVersions', () => {
        it('should list the pack versions for a Minecraft version', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const minecraftVersion = await MinecraftVersion.query().insert({
                version: '1.2.3'
            });

            await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: pack.id,
                minecraft_version_id: minecraftVersion.id
            });

            const expectedOutput = {
                version: 'test',
                changelog: 'test',
                pack_id: pack.id,
                minecraft_version_id: minecraftVersion.id,
                updated_at: null
            };

            const packVersions = await minecraftVersion.$relatedQuery('packVersions');

            expect(packVersions).toBeInstanceOf(Array);
            expect(packVersions).toHaveLength(1);

            const packVersion = packVersions[0];

            expect(packVersion).toBeInstanceOf(Object);
            expect(packVersion).toMatchObject(expectedOutput);
            expect(packVersion).toHaveProperty('id');
            expect(packVersion).toHaveProperty('created_at');
        });
    });
});