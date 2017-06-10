const config = require('./src/config').config;

// eslint-disable-next-line immutable/no-mutation
module.exports = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: './db/test.sqlite3',
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
    },

    development: {
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
    },

    production: {
        client: 'mysql',
        connection: {
            database: config.production.database.name,
            user: config.production.database.username,
            password: config.production.database.password,
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
    },
};
