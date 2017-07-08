const config = require('config');

// eslint-disable-next-line prefer-const
let knexConfig = {};

switch (config.util.getEnv('NODE_ENV')) {
    case 'test': {
        knexConfig.test = {
            client: 'sqlite3',
            connection: {
                filename: ':memory:',
            },
            migrations: {
                tableName: 'migrations',
                directory: `${__dirname}/db/migrations`,
            },
            seeds: {
                directory: `${__dirname}/db/seeds/test`,
            },
            useNullAsDefault: true,
            pool: {
                afterCreate: (conn, cb) => {
                    conn.run('PRAGMA foreign_keys = ON', cb);
                },
            },
        };
        break;
    }
    default:
    case 'development': {
        knexConfig.development = {
            client: 'sqlite3',
            connection: {
                filename: './db/development.sqlite3',
            },
            migrations: {
                tableName: 'migrations',
                directory: `${__dirname}/db/migrations`,
            },
            seeds: {
                directory: `${__dirname}/db/seeds/development`,
            },
            useNullAsDefault: true,
            pool: {
                afterCreate: (conn, cb) => {
                    conn.run('PRAGMA foreign_keys = ON', cb);
                },
            },
        };
        break;
    }
    case 'production': {
        knexConfig.production = {
            client: 'mysql',
            connection: {
                database: config.get('database.name'),
                user: config.get('database.username'),
                password: config.get('database.password'),
            },
            pool: {
                min: 2,
                max: 10,
            },
            migrations: {
                tableName: 'migrations',
                directory: `${__dirname}/db/migrations`,
            },
            seeds: {
                directory: `${__dirname}/db/seeds/production`,
            },
        };
        break;
    }
}

module.exports = knexConfig;
