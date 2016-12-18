import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../db';

import Pack from '../../src/models/Pack';
import PackTag from '../../src/models/PackTag';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: PackTag', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a pack tag', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const packTag = await PackTag.query().insert({
                tag: 'test',
                pack_id: 1
            });

            expect(packTag).to.be.an('object');

            expect(packTag).to.have.property('id').that.is.a('number');
            expect(packTag).to.have.property('id').that.equals(1);

            expect(packTag).to.have.property('tag').that.is.a('string');
            expect(packTag).to.have.property('tag').that.equals('test');

            expect(packTag).to.have.property('pack_id').that.is.a('number');
            expect(packTag).to.have.property('pack_id').that.equals(1);

            expect(packTag).to.have.property('created_at').that.is.a('string');
        });

        it('should not allow invalid characters when creating a tag', async function () {
            await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack',
                type: 'public'
            });

            const input = {
                tag: 'test*',
                pack_id: 1
            };

            const expectedError = '"tag": "should match pattern \\"^[A-Za-z0-9-_:]+$\\"';

            return expect(PackTag.query().insert(input)).to.be.rejectedWith(expectedError);
        });
    });

    describe('pack', function () {
        it('should attach a tag to a pack', async function () {
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
});