import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../../src/index';
import knex from '../../../db';

import * as testUtils from '../../utils';

chai.use(chaiHttp);

describe('Routes: /v1/users', function () {
    beforeEach(function (done) {
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

    after(function (done) {
        app.server.close();
        done();
    });

    describe('GET /v1/users', function () {
        describe('When Authenticated', function () {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async() => {
                created_role = await testUtils.createRole({
                    name: 'admin'
                });

                created_user = await testUtils.createUser({
                    username: 'test',
                    email: 'test@example.com'
                });

                await testUtils.addRoleToUser(created_role, created_user);

                client = await testUtils.createOAuthClient({
                    user_id: created_user.id
                });

                token = await testUtils.createAccessToken({
                    user_id: created_user.id,
                    client_id: client.id,
                    scope: 'admin:read'
                });
            });

            it('should return all the users in the system', async function () {
                const expectedOutput = {
                    username: 'test',
                    email: 'test@example.com',
                    must_change_password: false,
                    is_banned: false,
                    ban_reason: null,
                    is_verified: false,
                    tfa_secret: null,
                    updated_at: null,
                    verified_at: null,
                    banned_at: null
                };

                const response = await chai.request(app).get('/v1/users').set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.a('array');
                expect(body).to.have.length(2);

                const user = body[1];

                expect(user).to.be.an('object');
                expect(user).to.shallowDeepEqual(expectedOutput);
                expect(user).to.contain.all.keys(['id', 'created_at', 'verification_code']);
                expect(user.password).to.be.undefined;
            });
        });

        describe('When Unauthenticated', function () {
            it('should return an error if user doesn\'t have an admin role', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'user'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'admin:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'admin'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'self:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('GET /v1/users/{id}', function () {
        describe('When Authenticated', function () {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async() => {
                created_role = await testUtils.createRole({
                    name: 'admin'
                });

                created_user = await testUtils.createUser({
                    username: 'test',
                    email: 'test@example.com'
                });

                await testUtils.addRoleToUser(created_role, created_user);

                client = await testUtils.createOAuthClient({
                    user_id: created_user.id
                });

                token = await testUtils.createAccessToken({
                    user_id: created_user.id,
                    client_id: client.id,
                    scope: 'admin:read'
                });
            });

            it('should return the information for for the given user by their ID', async function () {
                const response = await chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('test');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('test@example.com');
            });

            it('should return a 404 error if the given user cannot be found', function (done) {
                (async() => {
                    chai.request(app).get(`/v1/users/42`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(404);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(404);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals('User with ID of 42 not found.');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the passed in user id isn\'t an integer', function (done) {
                (async() => {
                    chai.request(app).get(`/v1/users/bad`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const error = body.error;

                        expect(error).to.have.property('id').that.is.an('array');

                        expect(error.id[0]).to.be.a('string').that.equals('Id must be a valid number');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the passed in user id is <= 0', function (done) {
                (async() => {
                    chai.request(app).get(`/v1/users/-12`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const error = body.error;

                        expect(error).to.have.property('id').that.is.an('array');

                        expect(error.id[0]).to.be.a('string').that.equals('Id must be a valid number');

                        done();
                    });
                })();
            });
        });

        describe('When Unauthenticated', function () {
            it('should return an error if user doesn\'t have an admin role', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'user'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'admin:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'admin'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'self:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('POST /v1/users', function () {
        describe('When Authenticated', function () {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async() => {
                created_role = await testUtils.createRole({
                    name: 'admin'
                });

                created_user = await testUtils.createUser({
                    username: 'test',
                    email: 'test@example.com'
                });

                await testUtils.addRoleToUser(created_role, created_user);

                client = await testUtils.createOAuthClient({
                    user_id: created_user.id
                });

                token = await testUtils.createAccessToken({
                    user_id: created_user.id,
                    client_id: client.id,
                    scope: 'admin:write'
                });
            });

            it('should create a user', async function () {
                const user = {
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                };

                const response = await chai.request(app).post('/v1/users/').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('_test-User1');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('testuser@example.com');
            });

            it('should return a 400 error if the username is blank', function (done) {
                (async() => {
                    const user = {
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username can\'t be blank');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the password is blank', function (done) {
                (async() => {
                    const user = {
                        username: 'testuser',
                        email: 'testuser@example.com'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('password').that.is.an('array');
                        expect(error.password[0]).to.be.a('string').that.equals('Password can\'t be blank');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the email is blank', function (done) {
                (async() => {
                    const user = {
                        username: 'testuser',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('email').that.is.an('array');
                        expect(error.email[0]).to.be.a('string').that.equals('Email can\'t be blank');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the email is not an email', function (done) {
                (async() => {
                    const user = {
                        username: 'testuser',
                        email: 'testuser',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('email').that.is.an('array');
                        expect(error.email[0]).to.be.a('string').that.equals('Email is not a valid email');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is less than 4 characters', function (done) {
                (async() => {
                    const user = {
                        username: 'hi',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username must be at least 4 characters');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is more than 64 characters', function (done) {
                (async() => {
                    const user = {
                        username: 'testusertestusertestusertestusertestusertestusertestusertestuser1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username must be less than 64 characters');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username contains invalid characters', function (done) {
                (async() => {
                    const user = {
                        username: 'test&user',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username can only contain letters, numbers, underscores and dashes');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is atlauncher', function (done) {
                (async() => {
                    const user = {
                        username: 'atlauncher',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is admin', function (done) {
                (async() => {
                    const user = {
                        username: 'admin',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is root', function (done) {
                (async() => {
                    const user = {
                        username: 'root',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the password is less than 6 characters', function (done) {
                (async() => {
                    const user = {
                        username: 'testuser',
                        email: 'testuser@example.com',
                        password: 'test'
                    };

                    chai.request(app).post('/v1/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('password').that.is.an('array');
                        expect(error.password[0]).to.be.a('string').that.equals('Password must be at least 6 characters');

                        done();
                    });
                })();
            });
        });

        describe('When Unauthenticated', function () {
            it('should return an error if user doesn\'t have an admin role', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'user'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'admin:read'
                    });

                    chai.request(app).post('/v1/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'admin'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'self:read'
                    });

                    chai.request(app).post('/v1/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('PUT /v1/users/{id}', function () {
        describe('When Authenticated', function () {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async() => {
                created_role = await testUtils.createRole({
                    name: 'admin'
                });

                created_user = await testUtils.createUser({
                    username: 'test',
                    email: 'test@example.com'
                });

                await testUtils.addRoleToUser(created_role, created_user);

                client = await testUtils.createOAuthClient({
                    user_id: created_user.id
                });

                token = await testUtils.createAccessToken({
                    user_id: created_user.id,
                    client_id: client.id,
                    scope: 'admin:write'
                });
            });

            it('should update a user', async function () {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const updatedData = {
                    email: 'testuser1@example.com'
                };

                const response = await chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('_test-User1');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('testuser1@example.com');
            });

            it('should return a 400 error if the email is not an email', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'testuser',
                        email: 'testuser',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('email').that.is.an('array');
                        expect(error.email[0]).to.be.a('string').that.equals('Email is not a valid email');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is less than 4 characters', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'hi',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username must be at least 4 characters');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is more than 64 characters', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'testusertestusertestusertestusertestusertestusertestusertestuser1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username must be less than 64 characters');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username contains invalid characters', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'test&user',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username can only contain letters, numbers, underscores and dashes');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is atlauncher', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'atlauncher',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is admin', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'admin',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the username is root', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'root',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('username').that.is.an('array');
                        expect(error.username[0]).to.be.a('string').that.equals('Username is not allowed');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the password is less than 6 characters', function (done) {
                (async() => {
                    const user = await testUtils.createUser({
                        username: '_test-User1',
                        email: 'testuser@example.com',
                        password: 'testing'
                    });

                    const updatedData = {
                        username: 'testuser',
                        email: 'testuser@example.com',
                        password: 'test'
                    };

                    chai.request(app).put(`/v1/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const {error} = body;

                        expect(error).to.have.property('password').that.is.an('array');
                        expect(error.password[0]).to.be.a('string').that.equals('Password must be at least 6 characters');

                        done();
                    });
                })();
            });

            it('should return a 404 error if the user doesn\'t exist', function (done) {
                (async() => {
                    const updatedData = {
                        username: 'testuser',
                        email: 'testuser@example.com',
                        password: 'testing'
                    };

                    chai.request(app).put('/v1/users/42').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(404);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(404);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals('User with ID of 42 not found.');

                        done();
                    });
                })();
            });
        });

        describe('When Unauthenticated', function () {
            it('should return an error if user doesn\'t have an admin role', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'user'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'admin:read'
                    });

                    chai.request(app).post('/v1/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'admin'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'self:read'
                    });

                    chai.request(app).post('/v1/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('DELETE /v1/users/{id}', function () {
        describe('When Authenticated', function () {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async() => {
                created_role = await testUtils.createRole({
                    name: 'admin'
                });

                created_user = await testUtils.createUser({
                    username: 'test',
                    email: 'test@example.com'
                });

                await testUtils.addRoleToUser(created_role, created_user);

                client = await testUtils.createOAuthClient({
                    user_id: created_user.id
                });

                token = await testUtils.createAccessToken({
                    user_id: created_user.id,
                    client_id: client.id,
                    scope: 'admin:write'
                });
            });

            it('should delete the given user by their ID', async function () {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const response = await chai.request(app).delete(`/v1/users/${user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(204);
            });

            it('should return a 404 error if the given user cannot be found', function (done) {
                (async() => {
                    chai.request(app).delete(`/v1/users/42`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(404);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(404);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals('User with ID of 42 not found.');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the passed in user id isn\'t an integer', function (done) {
                (async() => {
                    chai.request(app).delete(`/v1/users/bad`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const error = body.error;

                        expect(error).to.have.property('id').that.is.an('array');

                        expect(error.id[0]).to.be.a('string').that.equals('Id must be a valid number');

                        done();
                    });
                })();
            });

            it('should return a 400 error if the passed in user id is <= 0', function (done) {
                (async() => {
                    chai.request(app).delete(`/v1/users/-12`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(400);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(400);

                        expect(body).to.have.property('error').that.is.an('object');

                        const error = body.error;

                        expect(error).to.have.property('id').that.is.an('array');

                        expect(error.id[0]).to.be.a('string').that.equals('Id must be a valid number');

                        done();
                    });
                })();
            });
        });

        describe('When Unauthenticated', function () {
            it('should return an error if user doesn\'t have an admin role', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'user'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'admin:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', function (done) {
                (async() => {
                    const created_role = await testUtils.createRole({
                        name: 'admin'
                    });

                    const created_user = await testUtils.createUser({
                        username: 'test',
                        email: 'test@example.com'
                    });

                    await testUtils.addRoleToUser(created_role, created_user);

                    const client = await testUtils.createOAuthClient({
                        user_id: created_user.id
                    });

                    const token = await testUtils.createAccessToken({
                        user_id: created_user.id,
                        client_id: client.id,
                        scope: 'self:read'
                    });

                    chai.request(app).get(`/v1/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(500);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(500);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });
});