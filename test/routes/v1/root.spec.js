import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import knexCleaner from 'knex-cleaner';

import app from '../../../src/server';
import knex from '../../../src/db';
import { version } from '../../../package.json';

import * as testUtils from '../../utils';

chai.use(chaiHttp);

describe('Routes: /v1', function () {
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