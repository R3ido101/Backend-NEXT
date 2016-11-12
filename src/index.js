import fs from 'fs';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import marked from 'marked';
import logger from 'morgan';
import express from 'express';
import passport from 'passport';
import { Model } from 'objection';
import flash from 'connect-flash';
import compress from 'compression';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import httpStatusCodes from 'http-status';
import RateLimit from 'express-rate-limit';
import ConnectSessionKnex from 'connect-session-knex';

import knex from '../db';
import routes from './routes';
import middleware from './middleware';
import errorHandlers from './errorHandlers';
import { environment, getConfig } from '../config';
import setupCustomValidators from './validation/custom';
import { convertTimeStringToMilliseconds } from './utils';

const config = getConfig();
const KnexSessionStore = new ConnectSessionKnex(session);
const sessionStore = new KnexSessionStore({
    tablename: 'sessions',
    createtable: false,
    knex
});

let app = express();
app.server = http.createServer(app);

// response time headers
app.use(responseTime({
    suffix: false
}));

// setup sessions
app.use(session({
    ...config.session,
    store: sessionStore
}));

Model.knex(knex);

// setup markdown view engine
app.engine('md', function (path, options, fn) {
    fs.readFile(path, 'utf8', function (err, str) {
        if (err) {
            return fn(err);
        }

        return fn(null, marked(str));
    });
});

// setup view engine and static
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(flash());
app.use(express.static(__dirname + '/public'));

// 3rd party middleware
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(cookieParser());
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({type: 'application/x-www-form-urlencoded', extended: true}));

// setup custom validations
setupCustomValidators();

// OAuth
app.use(passport.initialize());
app.use(passport.session());
require('./auth');

if (environment === 'development') {
    app.use(logger('dev'));
}

// internal middleware
app.use(middleware());

// rate limiting
app.use('/v1', new RateLimit({
    windowMs: convertTimeStringToMilliseconds(config.ratelimit.default.time),
    max: config.ratelimit.default.requests,
    delayMs: 0,
    statusCode: httpStatusCodes.TOO_MANY_REQUESTS,
    handler: function (req, res) {
        res.format({
            json: function () {
                res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({status: httpStatusCodes.TOO_MANY_REQUESTS, error: 'Too many requests'});
            }
        });
    },
    skip: function () {
        return environment === 'test';
    }
}));

// routes
routes(app);

// setup error handlers
errorHandlers(app);

app.server.listen(process.env.PORT || config.port);

if (environment !== 'test') {
    console.log(`Started on port ${app.server.address().port}`);
}

export default app;
