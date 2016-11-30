import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../../../src/index';
import knex from '../../../db';
import { version } from '../../../package.json';

chai.use(chaiHttp);

describe('/v1', function () {
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

    describe('GET /v1', function () {
        it('should return the version', async function () {
            const response = await chai.request(app).get('/v1');

            expect(response).to.have.status(200);
            expect(response).to.be.json;

            const body = response.body;

            expect(body).to.be.a('object');
            expect(body).to.have.property('version').that.is.a('string');
            expect(body).to.have.property('version').that.equals(version);
        });
    });
});