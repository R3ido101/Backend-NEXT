import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import app from '../../../src/server';
import knex from '../../../src/db';

import * as testUtils from '../../utils';

chai.use(chaiHttp);

describe('Routes: /v1/scopes', function () {
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

    describe('GET /v1/scopes', function () {
        it('should return all the scopes in the system', async function () {
            await testUtils.createScope({
                name: 'test',
                description: 'This is a test scope.'
            });

            const response = await chai.request(app).get('/v1/scopes');

            expect(response).to.have.status(200);
            expect(response).to.be.json;

            const body = response.body;

            expect(body).to.be.a('array');
            expect(body).to.have.length(1);

            const scope = body[0];

            expect(scope).to.be.an('object');
            expect(scope.name).to.equal('test');
            expect(scope.description).to.equal('This is a test scope.');
        });
    });
});