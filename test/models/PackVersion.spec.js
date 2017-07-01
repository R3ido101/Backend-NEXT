import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import PackVersion from '../../src/models/PackVersion';
import MinecraftVersion from '../../src/models/MinecraftVersion';

describe('Model: PackVersion', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', () => {
        it('should create a pack version', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: 'test',
                changelog: 'test',
                pack_id: pack.id
            });

            expect(packVersion).toBeInstanceOf(Object);
            expect(packVersion).toHaveProperty('id');
            expect(packVersion).toHaveProperty('pack_id', pack.id);
            expect(packVersion).toHaveProperty('minecraft_version_id', null);
            expect(packVersion).toHaveProperty('published_revision_id', null);
            expect(packVersion).toHaveProperty('version', 'test');
            expect(packVersion).toHaveProperty('changelog', 'test');
            expect(packVersion).toHaveProperty('created_at');
            expect(packVersion).toHaveProperty('updated_at', null);
            expect(packVersion).toHaveProperty('published_at', null);
        });
    });

    describe('minecraftVersion', () => {
        it('should get the Minecraft version for a pack version', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const createdMinecraftVersion = await MinecraftVersion.query().insert({
                version: '1.2.3'
            });

            const packVersion = await PackVersion.query().insert({
                version: 'test',
                minecraft_version_id: createdMinecraftVersion.id,
                changelog: ' test',
                pack_id: pack.id
            });

            const minecraftVersion = await packVersion.$relatedQuery('minecraftVersion');

            expect(minecraftVersion).toBeInstanceOf(Object);
            expect(minecraftVersion).toHaveProperty('version', '1.2.3');
        });
    });
});