const bcrypt = require('bcryptjs');

const config = require('config');

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
                id: '6a4133b2-aec9-4519-be18-e7df91e808b7',
                username: 'admin',
                password: bcrypt.hashSync('password', config.get('bcryptRounds')),
                email: 'admin@example.com',
                verification_code: 'testing',
                created_at: new Date().toJSON()
            }
        ]),
        knex('roles').insert({
            id: '8e3d9dfd-24a9-447d-96f5-eb573169d38d',
            name: 'admin',
            description: 'Can administer the system.',
            created_at: new Date().toJSON()
        }),
        knex('user_roles').insert({
            id: '5e3307ad-29d1-4efb-af6a-c983325677c9',
            role_id: '8e3d9dfd-24a9-447d-96f5-eb573169d38d',
            user_id: '6a4133b2-aec9-4519-be18-e7df91e808b7',
            created_at: new Date().toJSON()
        }),
        knex('oauth_clients').insert([
            {
                id: 'e537be97-4aa9-45f8-9225-e32640e1d4ae',
                name: 'Test',
                user_id: '6a4133b2-aec9-4519-be18-e7df91e808b7',
                client_id: 'test',
                client_secret: 'test',
                redirect_uri: 'http://127.0.0.1:3000/oauth'
            },
            {
                id: 'a58980c2-304c-4fbf-bb4c-248ba624f406',
                name: 'Postman',
                user_id: '6a4133b2-aec9-4519-be18-e7df91e808b7',
                client_id: 'postman',
                client_secret: 'postman',
                redirect_uri: 'https://www.getpostman.com/oauth2/callback'
            }
        ])
    );
};