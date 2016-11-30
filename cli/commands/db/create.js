import Faker from 'faker';

import User from '../../../src/models/User';

export async function user(args, callback) {
    const user = await User.query().insert({
        email: Faker.internet.email(),
        username: Faker.internet.userName(),
        password: Faker.internet.password()
    });

    this.log(`User created with username of ${user.username}`);
    callback();
}