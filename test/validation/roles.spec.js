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

    describe('POST', function () {
        it('should throw an error when the name isn\'t provided', function (done) {
            (async() => {
                const input = {
                    description: 'test'
                };

                const expectedOutput = {
                    name: [
                        'Name can\'t be blank'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the description isn\'t provided', function (done) {
            (async() => {
                const input = {
                    name: 'test'
                };

                const expectedOutput = {
                    description: [
                        'Description can\'t be blank'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name is less than 3 characters', function (done) {
            (async() => {
                const input = {
                    name: 'te',
                    description: 'test'
                };

                const expectedOutput = {
                    name: [
                        'Name must be at least 3 characters'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name is more than 255 characters', function (done) {
            (async() => {
                const input = {
                    name: 'testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1',
                    description: 'test'
                };

                const expectedOutput = {
                    name: [
                        'Name must be less than 255 characters'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name contains invalid characters', function (done) {
            (async() => {
                const input = {
                    name: 'test&user',
                    description: 'test'
                };

                const expectedOutput = {
                    name: [
                        'Name can only contain letters, numbers, underscores and dashes'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name is taken', function (done) {
            (async() => {
                await testUtils.createRole({
                    name: 'already-taken'
                });

                const input = {
                    name: 'already-taken',
                    description: 'test'
                };

                const expectedOutput = {
                    name: [
                        'Name is already taken'
                    ]
                };

                validate.async(input, rolesValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });
    });

    describe('PUT', function () {
        it('should throw an error when the name is less than 3 characters', function (done) {
            (async() => {
                const input = {
                    name: 'te'
                };

                const expectedOutput = {
                    name: [
                        'Name must be at least 3 characters'
                    ]
                };

                validate.async(input, rolesValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name is more than 255 characters', function (done) {
            (async() => {
                const input = {
                    name: 'testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1testroletestroletestroletestroletestroletestroletestroletestrole1'
                };

                const expectedOutput = {
                    name: [
                        'Name must be less than 255 characters'
                    ]
                };

                validate.async(input, rolesValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name contains invalid characters', function (done) {
            (async() => {
                const input = {
                    name: 'test&user'
                };

                const expectedOutput = {
                    name: [
                        'Name can only contain letters, numbers, underscores and dashes'
                    ]
                };

                validate.async(input, rolesValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the name is taken', function (done) {
            (async() => {
                await testUtils.createRole({
                    name: 'already-taken'
                });

                const input = {
                    name: 'already-taken'
                };

                const expectedOutput = {
                    name: [
                        'Name is already taken'
                    ]
                };

                validate.async(input, rolesValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });
    });
});