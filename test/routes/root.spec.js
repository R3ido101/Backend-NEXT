import supertest from 'supertest';
import knexCleaner from 'knex-cleaner';

import knex from '../../src/db';
import app from '../../src/server';

describe('Routes: /', () => {
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

    describe('GET /', () => {
        it('should return the version', async () => {
            const response = await supertest(app).get('/');

            expect(response).toHaveProperty('statusCode', 200);

            const body = response.body;

            expect(body).toBeInstanceOf(Object);
            expect(body).toHaveProperty('version', 'v1');
        });
    });
});