import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../../src/index';
import knex from '../../../db';

import * as testUtils from '../../utils';

chai.use(chaiHttp);

describe('Routes: /v1/scopes', function () {
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