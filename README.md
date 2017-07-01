[![CircleCI](https://circleci.com/gh/ATLauncher/Backend-NEXT/tree/feature%2Finitial-code.svg?style=svg)](https://circleci.com/gh/ATLauncher/Backend-NEXT/tree/feature%2Finitial-code)

# Backend-NEXT
Backend API server for ATLauncher NEXT.

## Development
If you wish to develop with this repository, please read the following sub sections.

### Installation
Before you begin you need to make sure you have the NodeJS 8 or newer installed on your computer.

**NOTE:** This repository is **NOT** compatible with Yarn. Please don't attempt to use Yarn. Support
will not be given with Yarn.

You will also want to make sure you've setup your system for NodeGyp by following their
[install docs](https://github.com/nodejs/node-gyp#installation) for your system.

Clone the repository and run the following commands under your project root:

```shell
npm install
```

Once done you need to run the migrations. In development mode (which is default) the application
will use a sqlite database at `/db/development.sqlite3`.

To run the migrations simply run:

```shell
npm run migrate
```

Once done you can start the development server by running:

```shell
npm run dev
```

### Testing
To run the tests simply run the following command:

```shell
npm test
```

You can run `npm run test:clean` which will remove the test database, run the migrations as well as
the seeds.

### Linting
Please make sure you run all your code through the linter before creating a pull request as all pull
requests are automatically checked by the CI process and will cause delays if not linted properly.

To run the linter:

```shell
npm run lint
```

### Database changes
When making any changes that require database schema changes, these must be done through the use of
migrations.

Migrations are meant to be run only once, and make the changes needed to the database while also
providing a way to rollback those changes.

To create a new migration, run the following:

```shell
node ./node_modules/knex/bin/cli.js migrate:make name_of_migration
```

The name of your migration should describe what it does. For instance when adding a new table called
'messages' it should be `create_messages_table`. And when changing a table it should be something
like `change_type_of_name_field_in_messages_table`.

All migrations should correctly roll back tables to their original state or remove tables/fields
added.

Once a migration is written, it should **NEVER** be modified. Any modifications to migrations can
cause data issues.

**NOTE**: Migration files will constantly be changing during initial development, so do not rely on
them functioning as proper migrations until the **feature/initial-code** branch has been merged into
the **develop** branch.

## Configuration
All configuration files can be found in the `/config` folder.

They're divided up into 5 main files:

 - `base.json`: This file is the very base file and contains configuration that is used in both
                production and development.
 - `test.json`: This file contains setting overrides for when in test.
 - `development.json`: This file contains setting overrides for when in development.
 - `production.json`: This file contains setting overrides for when in prodution.
 - `secret.json`: This file contains setting overrides for all environments and should be gitignored
                  or dynamically populated with a system like Ansible.

## Running in production
To run in production you should use some tool such as NodeMon or Forever to keep your server up and
running all the time.

First thing you need to do is run the migrations for the production environment:

```shell
NODE_ENV=production npm run migrate
```

This will run the migrations on the defined production database specified in `/knexfile.js` which by
default is set to use MySQL using the credentials in the production config.

Then once ready to run simply run:

```shell
NODE_ENV=production npm start
```

This will compile all the src files with babel and then run the server.

## Contributing
If you wish to contribute to this repository in any way, take a look at
[CONTRIBUTING.md](CONTRIBUTING.md).