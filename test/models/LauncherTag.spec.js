import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';

import Pack from '../../src/models/Pack';
import LauncherTag from '../../src/models/LauncherTag';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: LauncherTag', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a launcher tag', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const expectedOutput = {
                tag: 'test',
                pack_id: pack.id
            };

            const packTag = await LauncherTag.query().insert({
                tag: 'test',
                pack_id: pack.id
            });

            expect(packTag).to.be.an('object');
            expect(packTag).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(packTag).to.contain.all.keys(['id', 'created_at']); // things that return but are variable
        });

        it('should not allow invalid characters when creating a tag', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            const input = {
                tag: 'test*',
                pack_id: pack.id
            };

            const expectedError = {
                tag: [
                    {
                        message: 'should match pattern "^[A-Za-z0-9-_:]+$"',
                        keyword: 'pattern',
                        params: {
                            pattern: '^[A-Za-z0-9-_:]+$'
                        }
                    }
                ]
            };

            return expect(LauncherTag.query().insert(input)).to.be.rejectedWith(expectedError);
        });
    });

    describe('pack', function () {
        it('should attach a tag to a pack', async function () {
            const pack = await Pack.query().insert({
                name: 'Test Pack',
                description: 'This is a test pack'
            });

            await pack.$relatedQuery('launcherTags').insert({
                tag: 'test'
            });

            const launcherTags = await pack.$relatedQuery('launcherTags');

            expect(launcherTags).to.be.an('array').with.length(1);

            const packTag = launcherTags[0];

            expect(packTag).to.be.an('object');

            expect(packTag).to.have.property('tag').that.equals('test');

            expect(packTag).to.have.property('pack_id').that.equals(pack.id);
        });
    });
});