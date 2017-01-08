import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import app from '../../src/server';
import knex from '../../src/db';

import * as testUtils from '../utils';

chai.use(chaiHttp);

describe('Routes: /users', function () {
    before(function (done) {
        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach(function (done) {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    after(function (done) {
        app.server.close();
        done();
    });

    describe('GET /users', function () {
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

                const response = await chai.request(app).get('/users').set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.a('array');
                expect(body).to.have.length(1);

                const user = body[0];

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

                    chai.request(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('GET /users/{user_id}', function () {
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
                const response = await chai.request(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('test');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('test@example.com');
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

                    chai.request(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('POST /users', function () {
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

                const response = await chai.request(app).post('/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user);

                expect(response).to.have.status(201);
                expect(response).to.have.header('Location');
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('_test-User1');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('testuser@example.com');
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

                    chai.request(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('PUT /users/{user_id}', function () {
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

                const response = await chai.request(app).put(`/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.username).to.equal('_test-User1');
                expect(body.password).to.be.undefined;
                expect(body.email).to.equal('testuser1@example.com');
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

                    chai.request(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('DELETE /users/{user_id}', function () {
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

                const response = await chai.request(app).delete(`/users/${user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(204);
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

                    chai.request(app).delete(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).delete(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('GET /users/{user_id}/roles', function () {
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

            it('should get the roles for the given user by their ID', async function () {
                const user = await testUtils.createUser();

                const role = await testUtils.createRole({
                    name: 'test',
                    description: 'test role'
                });

                await testUtils.addRoleToUser(role, user);

                const response = await chai.request(app).get(`/users/${user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('array');

                const firstRole = body[0];

                expect(firstRole.name).to.equal('test');
                expect(firstRole.description).to.equal('test role');
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
                        scope: 'admin:write'
                    });

                    chai.request(app).get(`/users/${created_user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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

                    chai.request(app).get(`/users/${created_user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('PUT /users/{user_id}/roles/{role_id}', function () {
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

            it('should attach the given role to the user by their ID', async function () {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const role = await testUtils.createRole({
                    name: 'test',
                    description: 'test role'
                });

                const response = await chai.request(app).put(`/users/${user.id}/roles/${role.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.an('object');

                expect(body.name).to.equal('test');
                expect(body.description).to.equal('test role');
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
                        scope: 'admin:write'
                    });

                    chai.request(app).put(`/users/${created_user.id}/roles/1`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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
                        scope: 'self:write'
                    });

                    chai.request(app).put(`/users/${created_user.id}/roles/1`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('DELETE /users/{user_id}/roles/{role_id}', function () {
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

            it('should delete the given role from the user by their ID', async function () {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const role = await testUtils.createRole({
                    name: 'test'
                });

                await testUtils.addRoleToUser(role, user);

                const response = await chai.request(app).delete(`/users/${user.id}/roles/${role.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(204);
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
                        scope: 'admin:write'
                    });

                    chai.request(app).delete(`/users/${created_user.id}/roles/1`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

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
                        scope: 'self:write'
                    });

                    chai.request(app).delete(`/users/${created_user.id}/roles/1`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({response}) => {
                        expect(response).to.have.status(403);
                        expect(response).to.be.json;

                        const {body} = response;

                        expect(body).to.be.an('object');

                        expect(body).to.have.property('status').that.is.a('number');
                        expect(body).to.have.property('status').that.equals(403);

                        expect(body).to.have.property('error').that.is.a('string');
                        expect(body).to.have.property('error').that.equals("Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });
});