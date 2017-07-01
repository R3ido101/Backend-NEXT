import { Model } from 'objection';
import knexCleaner from 'knex-cleaner';

import knex from '../../../src/db';

import * as testUtils from '../../utils';
import UserRole from '../../../src/models/pivots/UserRole';

/**
 * These tests are here not to test the functionality of the provided Model library (Objection.js)
 * and is more to make sure commonly used queries (with custom changes to the models) are returning
 * as expected
 */
describe('Model: UserRole', () => {
    beforeAll((done) => {
        Model.knex(knex);

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('insert', () => {
        it('should create a user role', async () => {
            const user = await testUtils.createUser();
            const role = await testUtils.createRole();

            const expectedOutput = {
                user_id: user.id,
                role_id: role.id
            };

            const userRole = await UserRole.query().insert({
                user_id: user.id,
                role_id: role.id
            });

            expect(userRole).toBeInstanceOf(Object);
            expect(userRole).toMatchObject(expectedOutput);
            expect(userRole).toHaveProperty('id');
            expect(userRole).toHaveProperty('created_at');
        });

        it('should not create a user role when it already exists', async () => {
            const user = await testUtils.createUser();
            const role = await testUtils.createRole();
            await testUtils.addRoleToUser(role, user);

            const expectedOutput = {
                role_id: [
                    {
                        message: 'role_id is already taken.'
                    }
                ],
                user_id: [
                    {
                        message: 'user_id is already taken.'
                    }
                ]
            };

            try {
                await UserRole.query().insert({
                    user_id: user.id,
                    role_id: role.id
                });
            } catch (error) {
                expect(error.data).toEqual(expectedOutput);
            }
        });
    });
});