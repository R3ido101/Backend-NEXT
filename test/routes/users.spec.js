import supertest from 'supertest';
import knexCleaner from 'knex-cleaner';

import app from '../../src/server';
import knex from '../../src/db';

import * as testUtils from '../utils';

describe('Routes: /users', () => {
    beforeAll((done) => {
        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, { ignoreTables: ['migrations', 'migrations_lock'] }).then(() => done());
    });

    afterAll((done) => {
        app.server.close();
        done();
    });

    describe('GET /users', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should return all the users in the system', async () => {
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

                const response = await supertest(app).get('/users').set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 200);

                const body = response.body;

                expect(body).toBeInstanceOf(Array);
                expect(body).toHaveLength(1);

                const user = body[0];

                expect(user).toBeInstanceOf(Object);
                expect(user).toMatchObject(expectedOutput);
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('created_at');
                expect(user).toHaveProperty('verification_code');
                expect(user.password).toBeUndefined();
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('GET /users/{user_id}', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should return the information for for the given user by their ID', async () => {
                const response = await supertest(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 200);

                const body = response.body;

                expect(body).toBeInstanceOf(Object);

                expect(body).toHaveProperty('username', 'test');
                expect(body.password).toBeUndefined();
                expect(body).toHaveProperty('email', 'test@example.com');
            });

            it('should return an error when the user cannot be found by their id', (done) => {
                (async () => {
                    supertest(app).get(`/users/6a4133b2-aec9-4519-be18-e7df91e808b7`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).to.have.status(404);
                        expect(response).to.be.json;

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 404);
                        expect(body).toHaveProperty('message', 'User with ID of 6a4133b2-aec9-4519-be18-e7df91e808b7 not found.');

                        done();
                    });
                })();
            });

            it('should return an error when the user id is too long', (done) => {
                (async () => {
                    supertest(app).get(`/users/6a4133b2-aec9-4519-be18-e7df91e808b7`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).to.have.status(404);
                        expect(response).to.be.json;

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 404);
                        expect(body).toHaveProperty('message', 'User with ID of 6a4133b2-aec9-4519-be18-e7df91e808b7 not found.');

                        done();
                    });
                })();
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('POST /users', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should create a user', async () => {
                const user = {
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                };

                const response = await supertest(app).post('/users').set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(user);

                expect(response).toHaveProperty('statusCode', 201);
                expect(response).toHaveProperty('header.location');

                const body = response.body;

                expect(body).toBeInstanceOf(Object);

                expect(body).toHaveProperty('username', '_test-User1');
                expect(body.password).toBeUndefined();
                expect(body).toHaveProperty('email', 'testuser@example.com');
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', (done) => {
                (async () => {
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

                    supertest(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('PUT /users/{user_id}', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should update a user', async () => {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const updatedData = {
                    email: 'testuser1@example.com'
                };

                const response = await supertest(app).put(`/users/${user.id}`).set('Content-Type', 'application/json').set('Authorization', `Bearer ${token.access_token}`).send(updatedData);

                expect(response).toHaveProperty('statusCode', 200);

                const body = response.body;

                expect(body).toBeInstanceOf(Object);

                expect(body).toHaveProperty('username', '_test-User1');
                expect(body.password).toBeUndefined();
                expect(body).toHaveProperty('email', 'testuser1@example.com');
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', (done) => {
                (async () => {
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

                    supertest(app).post('/users/', {}).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('DELETE /users/{user_id}', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should delete the given user by their ID', async () => {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const response = await supertest(app).delete(`/users/${user.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 204);
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).delete(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:read scope', (done) => {
                (async () => {
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

                    supertest(app).delete(`/users/${created_user.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('GET /users/{user_id}/roles', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should get the roles for the given user by their ID', async () => {
                const user = await testUtils.createUser();

                const role = await testUtils.createRole({
                    name: 'test',
                    description: 'test role'
                });

                await testUtils.addRoleToUser(role, user);

                const response = await supertest(app).get(`/users/${user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 200);

                const body = response.body;

                expect(body).toBeInstanceOf(Array);

                const firstRole = body[0];

                expect(firstRole).toHaveProperty('name', 'test');
                expect(firstRole).toHaveProperty('description', 'test role');
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', (done) => {
                (async () => {
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

                    supertest(app).get(`/users/${created_user.id}/roles`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:read' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('PUT /users/{user_id}/roles/{role_id}', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should attach the given role to the user by their ID', async () => {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const role = await testUtils.createRole({
                    name: 'test',
                    description: 'test role'
                });

                const response = await supertest(app).put(`/users/${user.id}/roles/${role.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 200);

                const body = response.body;

                expect(body).toBeInstanceOf(Object);
                expect(body).toHaveProperty('role_id', role.id);
                expect(body).toHaveProperty('user_id', user.id);
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).put(`/users/${created_user.id}/roles/${created_role.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', (done) => {
                (async () => {
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

                    supertest(app).put(`/users/${created_user.id}/roles/${created_role.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });

    describe('DELETE /users/{user_id}/roles/{role_id}', () => {
        describe('When Authenticated', () => {
            let created_role;
            let created_user;
            let client;
            let token;

            beforeEach(async () => {
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

            it('should delete the given role from the user by their ID', async () => {
                const user = await testUtils.createUser({
                    username: '_test-User1',
                    email: 'testuser@example.com',
                    password: 'testing'
                });

                const role = await testUtils.createRole({
                    name: 'test'
                });

                await testUtils.addRoleToUser(role, user);

                const response = await supertest(app).delete(`/users/${user.id}/roles/${role.id}`).set('Authorization', `Bearer ${token.access_token}`);

                expect(response).toHaveProperty('statusCode', 204);
            });
        });

        describe('When Unauthenticated', () => {
            it('should return an error if user doesn\'t have an admin role', (done) => {
                (async () => {
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

                    supertest(app).delete(`/users/${created_user.id}/roles/${created_role.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "User doesn't have required role. 'admin' role is needed.");

                        done();
                    });
                })();
            });

            it('should return an error if token doesn\'t have the admin:write scope', (done) => {
                (async () => {
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

                    supertest(app).delete(`/users/${created_user.id}/roles/${created_role.id}`).set('Authorization', `Bearer ${token.access_token}`).then(() => {
                        done(new Error('Response was not an error.'));
                    }).catch(({ response }) => {
                        expect(response).toHaveProperty('statusCode', 403);

                        const { body } = response;

                        expect(body).toBeInstanceOf(Object);
                        expect(body).toHaveProperty('status', 403);
                        expect(body).toHaveProperty('message', "Invalid scope on token. Scope 'admin:write' is needed.");

                        done();
                    });
                })();
            });
        });
    });
});