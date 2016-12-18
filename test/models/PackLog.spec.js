import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../db';

import Pack from '../../src/models/Pack';
import User from '../../src/models/User';
import PackLog from '../../src/models/PackLog';
import PackVersion from '../../src/models/PackVersion';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackLog', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack log', async function () {
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

            const packLog = await PackLog.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                action: 'pack_install'
            });

            expect(packLog).to.be.an('object');

            expect(packLog).to.have.property('id').that.is.a('number');
            expect(packLog).to.have.property('id').that.equals(1);

            expect(packLog).to.have.property('pack_id').that.is.a('number');
            expect(packLog).to.have.property('pack_id').that.equals(1);

            expect(packLog).to.have.property('pack_version_id').that.is.a('number');
            expect(packLog).to.have.property('pack_version_id').that.equals(1);

            expect(packLog).to.have.property('user_id').that.is.a('number');
            expect(packLog).to.have.property('user_id').that.equals(1);

            expect(packLog).to.have.property('username').that.is.a('string');
            expect(packLog).to.have.property('username').that.equals('test');

            expect(packLog).to.have.property('action').that.is.a('string');
            expect(packLog).to.have.property('action').that.equals('pack_install');
        });
    });

    describe('pack', function () {
        it('should return the pack for a pack log', async function () {
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

            const packLog = await PackLog.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                action: 'pack_install'
            });

            const packs = await packLog.$relatedQuery('pack');

            expect(packs).to.be.an('array').with.length(1);

            const pack = packs[0];

            expect(pack).to.be.an('object');

            expect(pack).to.have.property('id').that.equals(1);

            expect(pack).to.have.property('name').that.equals('Test Pack');

            expect(pack).to.have.property('description').that.equals('This is a test pack');
        });
    });

    describe('packVersion', function () {
        it('should return the pack version for a pack log', async function () {
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

            const packLog = await PackLog.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                action: 'pack_install'
            });

            const packVersions = await packLog.$relatedQuery('packVersion');

            expect(packVersions).to.be.an('array').with.length(1);

            const packVersion = packVersions[0];

            expect(packVersion).to.be.an('object');

            expect(packVersion).to.have.property('id').that.equals(1);

            expect(packVersion).to.have.property('version').that.equals('1.2.3');
        });
    });

    describe('user', function () {
        it('should return the user for a pack log', async function () {
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

            const packLog = await PackLog.query().insert({
                pack_id: 1,
                user_id: 1,
                pack_version_id: 1,
                username: 'test',
                action: 'pack_install'
            });

            const users = await packLog.$relatedQuery('user');

            expect(users).to.be.an('array').with.length(1);

            const user = users[0];

            expect(user).to.be.an('object');

            expect(user).to.have.property('id').that.equals(1);

            expect(user).to.have.property('username').that.equals('test');

            expect(user).to.have.property('email').that.equals('test@example.com');
        });
    });
});