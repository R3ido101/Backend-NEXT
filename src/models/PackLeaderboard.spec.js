import { Model } from 'objection';
import chai, { expect } from 'chai';

import knex from '../../db';

import Pack from './Pack';
import User from './User';
import PackVersion from './PackVersion';
import PackLeaderboard from './PackLeaderboard';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackLeaderboard', function () {
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

    describe('insert', function () {
        it('should create a pack leaderboard', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                time_played: 44
            });

            expect(packLeaderboard).to.be.an('object');

            expect(packLeaderboard).to.have.property('id').that.is.a('number');
            expect(packLeaderboard).to.have.property('id').that.equals(1);

            expect(packLeaderboard).to.have.property('pack_id').that.is.a('number');
            expect(packLeaderboard).to.have.property('pack_id').that.equals(1);

            expect(packLeaderboard).to.have.property('pack_version_id').that.is.a('number');
            expect(packLeaderboard).to.have.property('pack_version_id').that.equals(1);

            expect(packLeaderboard).to.have.property('user_id').that.is.a('number');
            expect(packLeaderboard).to.have.property('user_id').that.equals(1);

            expect(packLeaderboard).to.have.property('username').that.is.a('string');
            expect(packLeaderboard).to.have.property('username').that.equals('test');

            expect(packLeaderboard).to.have.property('time_played').that.is.a('number');
            expect(packLeaderboard).to.have.property('time_played').that.equals(44);
        });
    });

    describe('pack', function () {
        it('should return the pack for a pack leaderboard', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                time_played: 44
            });

            const packs = await packLeaderboard.$relatedQuery('pack');

            expect(packs).to.be.an('array').with.length(1);

            const pack = packs[0];

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });
    });

    describe('packVersion', function () {
        it('should return the pack version for a pack leaderboard', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                time_played: 44
            });

            const packVersions = await packLeaderboard.$relatedQuery('packVersion');

            expect(packVersions).to.be.an('array').with.length(1);

            const packVersion = packVersions[0];

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('id').that.equals(1);

            expect(packVersion).to.have.property('version').that.equals('1.2.3');
        });
    });

    describe('user', function () {
        it('should return the user for a pack leaderboard', async function () {
            await User.query().insert({
                username: 'test',
                password: 'testing',
                email: 'test@example.com'
            });

            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            await PackVersion.query().insert({
                version: '1.2.3',
                pack_id: 1
            });

            const packLeaderboard = await PackLeaderboard.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                time_played: 44
            });

            const users = await packLeaderboard.$relatedQuery('user');

            expect(users).to.be.an('array').with.length(1);

            const user = users[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('id').that.equals(1);

            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});