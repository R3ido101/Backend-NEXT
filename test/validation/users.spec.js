import { expect } from 'chai';
import validate from 'validate.js';

import knex from '../../db';
import * as usersValidations from '../../src/validation/users';
import setupCustomValidators from '../../src/validation/custom';
import * as testUtils from '../utils';

describe('Validation: Users', function () {
    beforeEach(function (done) {
        setupCustomValidators();

        knex.migrate.rollback()
            .then(function () {
                knex.migrate.latest()
                    .then(function () {
                        return knex.seed.run()
                            .then(function () {
                                done();
                            });
                    });
            });
    });

    afterEach(function (done) {
        knex.migrate.rollback()
            .then(function () {
                done();
            });
    });

    describe('VALIDATE_ID', function () {
        it('should throw an error when the id isn\'t provided', async function () {
            const input = {};

            const expectedOutput = {
                id: [
                    'Id can\'t be blank'
                ]
            };

            const errors = validate(input, usersValidations.VALIDATE_ID);

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

            const errors = validate(input, usersValidations.VALIDATE_ID);

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

            const errors = validate(input, usersValidations.VALIDATE_ID);

            expect(errors).to.be.an('object').that.deep.equals(expectedOutput);
        });
    });

    describe('POST', function () {
        it('should throw an error when the username isn\'t provided', function (done) {
            (async() => {
                const input = {
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username can\'t be blank'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the email isn\'t provided', function (done) {
            (async() => {
                const input = {
                    username: 'test',
                    password: 'password'
                };

                const expectedOutput = {
                    email: [
                        'Email can\'t be blank'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the password isn\'t provided', function (done) {
            (async() => {
                const input = {
                    username: 'test',
                    email: 'test@example.com'
                };

                const expectedOutput = {
                    password: [
                        'Password can\'t be blank'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is less than 4 characters', function (done) {
            (async() => {
                const input = {
                    username: 'abc',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username must be at least 4 characters'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is more than 64 characters', function (done) {
            (async() => {
                const input = {
                    username: 'testusertestusertestusertestusertestusertestusertestusertestuser1',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username must be less than 64 characters'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the email is not valid', function (done) {
            (async() => {
                const input = {
                    username: 'testuser',
                    email: 'test@example',
                    password: 'password'
                };

                const expectedOutput = {
                    email: [
                        'Email is not a valid email'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username contains invalid characters', function (done) {
            (async() => {
                const input = {
                    username: 'test&user',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username can only contain letters, numbers, underscores and dashes'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is atlauncher', function (done) {
            (async() => {
                const input = {
                    username: 'atlauncher',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is root', function (done) {
            (async() => {
                const input = {
                    username: 'root',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is admin', function (done) {
            (async() => {
                const input = {
                    username: 'admin',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the password is less than 6 characters', function (done) {
            (async() => {
                const input = {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'pass'
                };

                const expectedOutput = {
                    password: [
                        'Password must be at least 6 characters'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is taken', function (done) {
            (async() => {
                await testUtils.createUser({
                    username: 'already-taken'
                });

                const input = {
                    username: 'already-taken',
                    email: 'test@example.com',
                    password: 'password'
                };

                const expectedOutput = {
                    username: [
                        'Username is already taken'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the email is taken', function (done) {
            (async() => {
                await testUtils.createUser({
                    email: 'already@taken.com'
                });

                const input = {
                    username: 'testuser',
                    email: 'already@taken.com',
                    password: 'password'
                };

                const expectedOutput = {
                    email: [
                        'Email is already taken'
                    ]
                };

                validate.async(input, usersValidations.POST).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });
    });

    describe('PUT', function () {
        it('should throw an error when the username is less than 4 characters', function (done) {
            (async() => {
                const input = {
                    username: 'abc'
                };

                const expectedOutput = {
                    username: [
                        'Username must be at least 4 characters'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is more than 64 characters', function (done) {
            (async() => {
                const input = {
                    username: 'testusertestusertestusertestusertestusertestusertestusertestuser1'
                };

                const expectedOutput = {
                    username: [
                        'Username must be less than 64 characters'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the email is not valid', function (done) {
            (async() => {
                const input = {
                    email: 'test@example'
                };

                const expectedOutput = {
                    email: [
                        'Email is not a valid email'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username contains invalid characters', function (done) {
            (async() => {
                const input = {
                    username: 'test&user'
                };

                const expectedOutput = {
                    username: [
                        'Username can only contain letters, numbers, underscores and dashes'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is atlauncher', function (done) {
            (async() => {
                const input = {
                    username: 'atlauncher'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is root', function (done) {
            (async() => {
                const input = {
                    username: 'root'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is admin', function (done) {
            (async() => {
                const input = {
                    username: 'admin'
                };

                const expectedOutput = {
                    username: [
                        'Username is not allowed'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the password is less than 6 characters', function (done) {
            (async() => {
                const input = {
                    password: 'pass'
                };

                const expectedOutput = {
                    password: [
                        'Password must be at least 6 characters'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the username is taken', function (done) {
            (async() => {
                await testUtils.createUser({
                    username: 'already-taken'
                });

                const input = {
                    username: 'already-taken'
                };

                const expectedOutput = {
                    username: [
                        'Username is already taken'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });

        it('should throw an error when the email is taken', function (done) {
            (async() => {
                await testUtils.createUser({
                    email: 'already@taken.com'
                });

                const input = {
                    email: 'already@taken.com'
                };

                const expectedOutput = {
                    email: [
                        'Email is already taken'
                    ]
                };

                validate.async(input, usersValidations.PUT).then(() => {
                    done(new Error('Response was not an error.'));
                }).catch((errors) => {
                    expect(errors).to.be.an('object').that.deep.equals(expectedOutput);

                    done();
                });
            })();
        });
    });
});