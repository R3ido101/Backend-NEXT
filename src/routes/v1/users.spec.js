import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';
import knex from '../../../db';

import * as testUtils from '../../../test/utils';

chai.use(chaiHttp);

describe('/v1/users', function () {
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
                const response = await chai.request(app).get('/v1/users').set('Authorization', `Bearer ${token.access_token}`);

                expect(response).to.have.status(200);
                expect(response).to.be.json;

                const body = response.body;

                expect(body).to.be.a('array');
                expect(body).to.have.length(2);

                const user = body[1];

                expect(user).to.be.an('object');
                expect(user.username).to.equal('test');
                expect(user.email).to.equal('test@example.com');
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

                        expect(body).to.have.property('error').that.is.an('array');

                        const firstError = body.error[0];

                        expect(firstError).to.have.property('param').that.equals('user_id');
                        expect(firstError).to.have.property('msg').that.equals('Invalid user_id');
                        expect(firstError).to.have.property('value').that.equals('bad');

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

                        expect(body).to.have.property('error').that.is.an('array');

                        const firstError = body.error[0];

                        expect(firstError).to.have.property('param').that.equals('user_id');
                        expect(firstError).to.have.property('msg').that.equals('Invalid user_id');
                        expect(firstError).to.have.property('value').that.equals('-12');

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