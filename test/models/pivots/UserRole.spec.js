import { Model } from 'objection';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import knex from '../../../src/db';

import * as testUtils from '../../utils';
import UserRole from '../../../src/models/pivots/UserRole';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js) and is more to make sure commonly used queries (with custom changes to the models) are returning as
 * expected
 */
describe('Model: UserRole', function () {
    before(function (done) {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', function () {
        it('should create a user role', async function () {
            const expectedOutput = {
                id: 1,
                user_id: 1,
                role_id: 1
            };

            await testUtils.createUser();
            await testUtils.createRole();

            const userRole = await UserRole.query().insert({
                user_id: 1,
                role_id: 1
            });

            expect(userRole).to.be.an('object');
            expect(userRole).to.shallowDeepEqual(expectedOutput); // match our expectedOutput exactly but don't fail on missing
            expect(userRole).to.contain.all.keys(['created_at']); // things that return but are variable
        });

        it('should not create a user role when it already exists', async function () {
            const expectedOutput = {
                role_id: 'role_id is already taken.',
                user_id: 'user_id is already taken.'
            };

            const user = await testUtils.createUser();
            const role = await testUtils.createRole();
            await testUtils.addRoleToUser(role, user);

            try {
                await UserRole.query().insert({
                    user_id: 1,
                    role_id: 1
                });
            } catch (error) {
                expect(error.data).to.deep.equal(expectedOutput);
            }
        });
    });
});