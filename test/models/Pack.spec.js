import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import User from '../../src/models/User';
import PackLog from '../../src/models/PackLog';
import PackVersion from '../../src/models/PackVersion';
import PackLeaderboard from '../../src/models/PackLeaderboard';

describe('Model: Pack', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('findById', () => {
        it('should return the data for the given pack', async () => {
            const expectedOutput = {
                name: 'Test Pack',
                safe_name: 'TestPack',
                description: 'This is a test pack',
                position: 1,
                is_disabled: false,
                updated_at: null,
                disabled_at: null
            };

            const created = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const pack = await Pack.query().findById(created.id);

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toMatchObject(expectedOutput);
            expect(pack).toHaveProperty('id');
            expect(pack).toHaveProperty('created_at');
        });

        it('should return undefined if a pack cannot be found by id', async () => {
            const pack = await Pack.query().findById(1);

            expect(pack).toBeUndefined();
        });
    });

    describe('insert', () => {
        it('should create a pack', async () => {
            const expectedOutput = {
                name: 'Test Pack',
                safe_name: 'TestPack',
                description: 'This is a test pack',
                position: 1,
                is_disabled: false,
                updated_at: null,
                disabled_at: null
            };

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toMatchObject(expectedOutput);
            expect(pack).toHaveProperty('id');
            expect(pack).toHaveProperty('created_at');
        });

        it('should create a pack with position 2 when a pack already exists', async () => {
            const expectedOutput = {
                name: 'Test Pack',
                safe_name: 'TestPack',
                description: 'This is a test pack',
                position: 2,
                is_disabled: false,
                updated_at: null,
                disabled_at: null
            };

            await Pack.query().insert({
                name: 'Test Pack Position 1',
                description: 'This is a test pack'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            expect(pack).toBeInstanceOf(Object);
            expect(pack).toMatchObject(expectedOutput);
            expect(pack).toHaveProperty('id');
            expect(pack).toHaveProperty('created_at');
        });
    });

    describe('launcherTags', () => {
        it('should attach a launcher tag to a pack', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('launcherTags').insert({
                tag: 'test'
            });

            const launcherTags = await pack.$relatedQuery('launcherTags');

            expect(launcherTags).toBeInstanceOf(Array);
            expect(launcherTags).toHaveLength(1);

            const launcherTag = launcherTags[0];

            expect(launcherTag).toBeInstanceOf(Object);
            expect(launcherTag).toHaveProperty('tag', 'test');
            expect(launcherTag).toHaveProperty('pack_id', pack.id);
        });
    });

    describe('packLeaderboards', () => {
        it('should return the pack leaderboards for a user', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            await PackLeaderboard.query().insert({
                pack_id: pack.id,
                pack_version_id: packVersion.id,
                username: 'test',
                time_played: 44
            });

            const packLeaderboards = await pack.$relatedQuery('packLeaderboards');

            expect(packLeaderboards).toBeInstanceOf(Array);
            expect(packLeaderboards).toHaveLength(1);

            const packLeaderboard = packLeaderboards[0];

            expect(packLeaderboard).toBeInstanceOf(Object);
            expect(packLeaderboard).toHaveProperty('id');
            expect(packLeaderboard).toHaveProperty('username', 'test');
            expect(packLeaderboard).toHaveProperty('time_played', 44);
        });
    });

    describe('packLogs', () => {
        it('should return the pack logs for a user', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const packVersion = await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: pack.id
            });

            await PackLog.query().insert({
                pack_id: pack.id,
                pack_version_id: packVersion.id,
                username: 'test',
                action: 'pack_install'
            });

            const packLogs = await pack.$relatedQuery('packLogs');

            expect(packLogs).toBeInstanceOf(Array);
            expect(packLogs).toHaveLength(1);

            const packLog = packLogs[0];

            expect(packLog).toBeInstanceOf(Object);
            expect(packLog).toHaveProperty('id');
            expect(packLog).toHaveProperty('username', 'test');
            expect(packLog).toHaveProperty('action', 'pack_install');
        });
    });

    describe('packTags', () => {
        it('should attach a pack tag to a pack', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('packTags').insert({
                tag: 'test'
            });

            const packTags = await pack.$relatedQuery('packTags');

            expect(packTags).toBeInstanceOf(Array);
            expect(packTags).toHaveLength(1);

            const packTag = packTags[0];

            expect(packTag).toBeInstanceOf(Object);
            expect(packTag).toHaveProperty('tag', 'test');
            expect(packTag).toHaveProperty('pack_id', pack.id);
        });
    });

    describe('users', () => {
        it('should create a user for a pack', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('users').insert({
                username: 'testuser',
                password: 'password',
                email: 'test@example.com'
            });

            const packUsers = await pack.$relatedQuery('users');

            expect(packUsers).toBeInstanceOf(Array);
            expect(packUsers).toHaveLength(1);

            const user = packUsers[0];

            expect(user).toBeInstanceOf(Object);
            expect(user).toHaveProperty('username', 'testuser');
            expect(user).toHaveProperty('email', 'test@example.com');
        });

        it('should attach a user to a pack', async () => {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const created = await User.query().insert({
                username: 'testuser',
                password: 'test',
                email: 'test@example.com'
            });

            await pack.$relatedQuery('users').relate(created.id);

            const packUsers = await pack.$relatedQuery('users');

            expect(packUsers).toBeInstanceOf(Array);
            expect(packUsers).toHaveLength(1);

            const user = packUsers[0];

            expect(user).toBeInstanceOf(Object);
            expect(user).toHaveProperty('username', 'testuser');
            expect(user).toHaveProperty('email', 'test@example.com');
        });
    });
});