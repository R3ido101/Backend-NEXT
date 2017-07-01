import supertest from 'supertest';
import knexCleaner from 'knex-cleaner';

import app from '../../src/server';
import knex from '../../src/db';

import * as testUtils from '../utils';

describe('Routes: /scopes', () => {
    beforeAll((done) => {
        knex.migrate.rollback().then(() => knex.migrate.latest().then(() => done()));
    });

    afterEach((done) => {
        knexCleaner.clean(knex, {ignoreTables: ['migrations', 'migrations_lock']}).then(() => done());
    });

    afterAll((done) => {
        app.server.close();
        done();
    });

    describe('GET /scopes', () => {
        it('should return all the scopes in the system', async () => {
            await testUtils.createScope({
                name: 'test',
                description: 'This is a test scope.'
            });

            const response = await supertest(app).get('/scopes');

            expect(response).toHaveProperty('statusCode', 200);

            const body = response.body;

            expect(body).toBeInstanceOf(Array);
            expect(body).toHaveLength(1);

            const scope = body[0];

            expect(scope).toBeInstanceOf(Object);
            expect(scope).toHaveProperty('name', 'test');
            expect(scope).toHaveProperty('description', 'This is a test scope.');
        });
    });
});