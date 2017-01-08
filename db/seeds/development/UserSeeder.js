const bcrypt = require('bcryptjs');

const getConfig = require('../../../src/config').getConfig;

const config = getConfig();

exports.seed = function (knex, Promise) {
    return Promise.join(
        // Deletes ALL existing entries
        knex('users').del(),
        knex('roles').del(),
        knex('user_roles').del(),
        knex('oauth_clients').del(),

        // Inserts seed entries
        knex('users').insert([
            {
                username: 'admin',
                password: bcrypt.hashSync('password', config.bcryptRounds),
                email: 'admin@example.com',
                verification_code: 'testing',
                created_at: new Date().toJSON()
            }
        ]),
        knex('roles').insert({
            name: 'admin',
            description: 'Can administer the system.',
            created_at: new Date().toJSON()
        }),
        knex('user_roles').insert({
            role_id: 1,
            user_id: 1,
            created_at: new Date().toJSON()
        }),
        knex('oauth_clients').insert([
            {
                name: 'Test',
                user_id: 1,
                client_id: 'test',
                client_secret: 'test',
                redirect_uri: 'http://127.0.0.1:3000/oauth'
            },
            {
                name: 'Postman',
                user_id: 1,
                client_id: 'postman',
                client_secret: 'postman',
                redirect_uri: 'https://www.getpostman.com/oauth2/callback'
            }
        ])
    );
};