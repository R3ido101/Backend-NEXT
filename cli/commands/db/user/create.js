import Faker from 'faker';

import User from '../../../../src/models/User';

export default {
    command: 'db:user:create',
    description: 'Creates a user in the database.',
    option: {
        name: '-r, --random',
        description: 'Uses completely random data instead of asking for input.'
    },
    action: function (args, callback) {
        const defaults = {
            email: Faker.internet.email(),
            password: Faker.internet.password(),
            username: Faker.internet.userName()
        };

        if (args.options.random) {
            createUser(defaults, this);

            return callback();
        }

        return this.prompt([
            {
                name: 'username',
                default: Faker.internet.userName(),
                message: 'Username (blank for random): '
            },
            {
                name: 'email',
                default: Faker.internet.email(),
                message: 'Email (blank for random): '
            },
            {
                name: 'password',
                default: Faker.internet.password(),
                message: 'Password (blank for random): '
            }
        ], (answers) => {
            createUser(answers, this);

            return callback();
        });
    }
};

async function createUser(data, thisArg) {
    await User.query().insert({
        email: data.email,
        password: data.password,
        username: data.username
    });

    thisArg.log(`User created with username of '${data.username}' and password of '${data.password}'`);
}