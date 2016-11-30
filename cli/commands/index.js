import { user as createUser } from './db/create';

export default function addCommands(vantage) {
    vantage
        .command('db:create:user')
        .description('Creates a user in the database.')
        .action(createUser);
}