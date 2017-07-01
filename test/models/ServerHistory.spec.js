import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import Server from '../../src/models/Server';
import PackVersion from '../../src/models/PackVersion';
import ServerHistory from '../../src/models/ServerHistory';

describe('Model: ServerHistory', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given server history', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                online: true,
                players: 22
            };

            const created = await ServerHistory.query().insert({
                server_id: server.id,
                online: true,
                players: 22
            });

            const serverHistory = await ServerHistory.query().findById(created.id);

            expect(serverHistory).toBeInstanceOf(Object);
            expect(serverHistory).toMatchObject(expectedOutput);
            expect(serverHistory).toHaveProperty('id');
            expect(serverHistory).toHaveProperty('created_at');
        });
    });

    describe('insert', () => {
        it('should create a server history', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                online: true,
                players: 22
            };

            const serverHistory = await ServerHistory.query().insert({
                server_id: server.id,
                online: true,
                players: 22
            });

            expect(serverHistory).toBeInstanceOf(Object);
            expect(serverHistory).toMatchObject(expectedOutput);
            expect(serverHistory).toHaveProperty('id');
            expect(serverHistory).toHaveProperty('created_at');
        });
    });
});