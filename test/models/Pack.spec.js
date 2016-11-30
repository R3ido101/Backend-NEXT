import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from '../../src/models/Pack';
import User from '../../src/models/User';
import PackLog from '../../src/models/PackLog';
import PackVersion from '../../src/models/PackVersion';
import PackLeaderboard from '../../src/models/PackLeaderboard';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: Pack', function () {
    before(() => {
        Model.knex(knex);
    });

    beforeEach(function (done) {
        knex.migrate.rollback().then(function () {
            knex.migrate.latest().then(() => done());
        });
    });

    afterEach(function (done) {
        knex.migrate.rollback().then(() => done());
    });

    describe('findById', function () {
        it('should return the data for the given pack', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const pack = await Pack.query().findById(1);

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.is.a('number');
            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.is.a('string');
            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.is.a('string');
            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.is.a('string');
            expect(pack).to.have.property('description').that.equals('This is a test pack');

            expect(pack).to.have.property('type').that.is.a('string');
            expect(pack).to.have.property('type').that.equals('public');

            expect(pack).to.have.property('enabled').that.is.a('boolean');
            expect(pack).to.have.property('enabled').that.equals(true);

            expect(pack).to.have.property('created_at').that.is.a('string');
            expect(pack).to.have.property('updated_at').that.is.null;
            expect(pack).to.have.property('disabled_at').that.is.null;
        });

        it('should return undefined if a pack cannot be found by id', async function () {
            const pack = await Pack.query().findById(1);

            expect(pack).to.be.undefined;
        });
    });

    describe('insert', function () {
        it('should create a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.is.a('number');
            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.is.a('string');
            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('safe_name').that.is.a('string');
            expect(pack).to.have.property('safe_name').that.equals('TestPack');

            expect(pack).to.have.property('description').that.is.a('string');
            expect(pack).to.have.property('description').that.equals('This is a test pack');

            expect(pack).to.have.property('type').that.is.a('string');
            expect(pack).to.have.property('type').that.equals('public');

            expect(pack).to.have.property('enabled').that.is.a('boolean');
            expect(pack).to.have.property('enabled').that.equals(true);

            expect(pack).to.have.property('created_at').that.is.a('string');

            expect(pack).to.have.property('updated_at').that.is.null;

            expect(pack).to.have.property('disabled_at').that.is.null;
        });
    });

    describe('launcherTags', function () {
        it('should attach a launcher tag to a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('launcherTags').insert({
                tag: 'test'
            });

            const launcherTags = await pack.$relatedQuery('launcherTags');

            expect(launcherTags).to.be.an('array').with.length(1);

            const launcherTag = launcherTags[0];

            expect(launcherTag).to.be.an('object');

            expect(launcherTag).to.have.property('tag').that.equals('test');

            expect(launcherTag).to.have.property('pack_id').that.equals(1);
        });
    });

    describe('packLeaderboards', function () {
        it('should return the pack leaderboards for a user', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            await PackLeaderboard.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                time_played: 44
            });

            const packLeaderboards = await pack.$relatedQuery('packLeaderboards');

            expect(packLeaderboards).to.be.an('array').with.length(1);

            const packLeaderboard = packLeaderboards[0];

            expect(packLeaderboard).to.be.an('object');

            expect(packLeaderboard).to.have.property('id').that.equals(1);

            expect(packLeaderboard).to.have.property('username').that.equals('test');

            expect(packLeaderboard).to.have.property('time_played').that.equals(44);
        });
    });

    describe('packLogs', function () {
        it('should return the pack logs for a user', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            await PackLog.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                action: 'pack_install'
            });

            const packLogs = await pack.$relatedQuery('packLogs');

            expect(packLogs).to.be.an('array').with.length(1);

            const packLog = packLogs[0];

            expect(packLog).to.be.an('object');

            expect(packLog).to.have.property('id').that.equals(1);

            expect(packLog).to.have.property('username').that.equals('test');

            expect(packLog).to.have.property('action').that.equals('pack_install');
        });
    });

    describe('packTags', function () {
        it('should attach a pack tag to a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('packTags').insert({
                tag: 'test'
            });

            const packTags = await pack.$relatedQuery('packTags');

            expect(packTags).to.be.an('array').with.length(1);

            const packTag = packTags[0];

            expect(packTag).to.be.an('object');

            expect(packTag).to.have.property('tag').that.equals('test');

            expect(packTag).to.have.property('pack_id').that.equals(1);
        });
    });

    describe('users', function () {
        it('should create a user for a pack', async function () {
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

            expect(packUsers).to.be.an('array').with.length(1);

            const user = packUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('testuser');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });

        it('should attach a user to a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await User.query().insert({
                username: 'testuser',
                password: 'test',
                email: 'test@example.com'
            });

            await pack.$relatedQuery('users').relate(1);

            const packUsers = await pack.$relatedQuery('users');

            expect(packUsers).to.be.an('array').with.length(1);

            const user = packUsers[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('username').that.equals('testuser');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});