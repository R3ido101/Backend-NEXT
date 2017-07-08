import cors from 'cors';
import http from 'http';
import path from 'path';
import config from 'config';
import helmet from 'helmet';
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
import addRequestId from 'express-request-id';
import ConnectSessionKnex from 'connect-session-knex';
import { setByAccept, validateVersion } from 'express-request-version';

import knex from './db';
import logger from './logger';
import routes from './routes';
import { setupAuth } from './auth';
import middleware from './middleware';
import errorHandlers from './errorHandlers';
import { convertTimeStringToMilliseconds } from './utils';

const KnexSessionStore = new ConnectSessionKnex(session);
const sessionStore = new KnexSessionStore({
    tablename: 'sessions',
    createtable: false,
    knex,
});

const app = express();
app.server = http.createServer(app);

// response time headers
app.use(responseTime({
    suffix: false,
}));

// setup sessions
app.use(session({
    ...config.get('session'),
    store: sessionStore,
}));

Model.knex(knex);

// setup view engine and static
app.set('view engine', 'ejs');
app.set('views', [
    `${__dirname}/views`,
    path.resolve(__dirname, '../docs'),
]);
app.use(flash());
app.use(express.static(`${__dirname}/public`));

// 3rd party middleware
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(cookieParser());
app.use(bodyParser.json({type: 'application/json'}));
app.use(bodyParser.urlencoded({
    type: 'application/x-www-form-urlencoded',
    extended: true,
}));

// oAuth
app.use(passport.initialize());
app.use(passport.session());
setupAuth();

// provide req.version for the version in each request
app.use(setByAccept('vnd.atlauncher', '.', '+json'));

// if no version provided, assume v1
app.use(function (req, res, next) {
    if (!req.version) {
        req.version = 'v1';
    }

    next();
});

// only allow v1 accept header
app.use(validateVersion(['v1']));

// add a X-Request-Id header to all responses
app.use(addRequestId());

// internal middleware
app.use(middleware());

// rate limiting
app.use('/', new RateLimit({
    windowMs: convertTimeStringToMilliseconds(config.get('ratelimit.default.time')),
    max: config.get('ratelimit.default.requests'),
    delayMs: 0,
    statusCode: httpStatusCodes.TOO_MANY_REQUESTS,
    handler: function (req, res) {
        res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({
            status: httpStatusCodes.TOO_MANY_REQUESTS,
            error: 'Too many requests',
        });
    },
    skip: function () {
        return config.util.getEnv('NODE_ENV') === 'test';
    },
}));

// routes
routes(app);

// setup error handlers
errorHandlers(app);

app.server.listen(config.get('port'));

if (config.util.getEnv('NODE_ENV') !== 'test') {
    logger.info(`Started on port ${app.server.address().port}`);
}

process.on('unhandledRejection', function (reason, p) {
    logger.error(`Possibly Unhandled Rejection at: ${p} reason: ${reason}`);
});

export default app;
