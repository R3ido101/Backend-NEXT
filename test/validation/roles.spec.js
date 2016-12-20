import { expect } from 'chai';
import validate from 'validate.js';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';
import * as testUtils from '../utils';
import * as rolesValidations from '../../src/validation/roles';
import setupCustomValidators from '../../src/validation/custom';

describe('Validation: Roles', function () {
    before(function (done) {
        setupCustomValidators();

        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    describe('VALIDATE_ID', function () {
        it('should throw an error when the id isn\'t provided', async function () {
            const input = {};

            const expectedOutput = {
                id: [
                    'Id can\'t be blank'
                ]
            };

            const errors = validate(input, rolesValidations.VALIDATE_ID);

            expect(errors).to.be.an('object').that.deep.equals(expectedOutput);
        });

        it('should throw an error when the id is less than 0', async function () {
            const input = {
                id: -4
            };

            const expectedOutput = {
                id: [
                    'Id must be greater than 0'
                ]
            };

            const errors = validate(input, rolesValidations.VALIDATE_ID);

            expect(errors).to.be.an('object').that.deep.equals(expectedOutput);
        });

        it('should throw an error when the id is not a number', async function () {
            const input = {
                id: 'test'
            };

            const expectedOutput = {
                id: [
                    'Id must be a valid number'
                ]
            };

            const errors = validate(input, rolesValidations.VALIDATE_ID);

            expect(errors).to.be.an('object').that.deep.equals(expectedOutput);
        });
    });
});