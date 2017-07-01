import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import Server from '../../src/models/Server';
import PackVersion from '../../src/models/PackVersion';

describe('Model: Server', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given server', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const expectedOutput = {
                name: 'Test Server',
                host: '127.0.0.1',
                port: 25565,
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id,
                banner_url: null,
                website_url: null,
                discord_invite_code: null,
                votifier_host: null,
                votifier_port: null,
                updated_at: null
            };

            const created = await Server.query().insert({
                name: 'Test Server',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const server = await Server.query().findById(created.id);

            expect(server).toBeInstanceOf(Object);
            expect(server).toMatchObject(expectedOutput);
            expect(server).toHaveProperty('id');
            expect(server).toHaveProperty('created_at');
        });
    });

    describe('insert', () => {
        it('should create a server', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const expectedOutput = {
                name: 'Test Server',
                host: '127.0.0.1',
                port: 25565,
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id,
                banner_url: null,
                website_url: null,
                discord_invite_code: null,
                votifier_host: null,
                votifier_port: null,
                updated_at: null
            };

            const server = await Server.query().insert({
                name: 'Test Server',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            expect(server).toBeInstanceOf(Object);
            expect(server).toMatchObject(expectedOutput);
            expect(server).toHaveProperty('id');
            expect(server).toHaveProperty('created_at');
        });
    });
});