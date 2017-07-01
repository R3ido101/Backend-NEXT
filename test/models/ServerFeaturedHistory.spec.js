import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import User from '../../src/models/User';
import Server from '../../src/models/Server';
import PackVersion from '../../src/models/PackVersion';
import ServerFeaturedHistory from '../../src/models/ServerFeaturedHistory';

describe('Model: ServerFeaturedHistory', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given server feature history', async () => {
            const user = await User.query().insert({
                username: 'Test',
                email: 'test@example.com',
                password: 'test'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerFeaturedHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14
            };

            const serverFeaturedHistory = await ServerFeaturedHistory.query().insert({
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14,
                expires_at: new Date().toJSON()
            });

            const serverHistory = await ServerFeaturedHistory.query().findById(serverFeaturedHistory.id);

            expect(serverHistory).toBeInstanceOf(Object);
            expect(serverHistory).toMatchObject(expectedOutput);
            expect(serverHistory).toHaveProperty('id');
            expect(serverHistory).toHaveProperty('created_at');
            expect(serverHistory).toHaveProperty('expires_at');
        });
    });

    describe('insert', () => {
        it('should create a server feature history', async () => {
            const user = await User.query().insert({
                username: 'Test',
                email: 'test@example.com',
                password: 'test'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'Test Pack Description'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            const server = await Server.query().insert({
                name: 'Test ServerFeaturedHistory',
                host: '127.0.0.1',
                description: 'This is a test pack and it is for a test pack',
                pack_id: pack.id,
                pack_version_id: packVersion.id
            });

            const expectedOutput = {
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14
            };

            const serverHistory = await ServerFeaturedHistory.query().insert({
                server_id: server.id,
                user_id: user.id,
                price: 5.55,
                transaction_id: 'asldhjaslkdjlkas1234',
                days: 14,
                expires_at: new Date().toJSON()
            });

            expect(serverHistory).toBeInstanceOf(Object);
            expect(serverHistory).toMatchObject(expectedOutput);
            expect(serverHistory).toHaveProperty('id');
            expect(serverHistory).toHaveProperty('created_at');
        });
    });
});