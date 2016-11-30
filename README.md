[![CircleCI](https://circleci.com/gh/ATLauncher/Backend-NEXT/tree/feature/initial-code.svg?style=svg)](https://circleci.com/gh/ATLauncher/Backend-NEXT/tree/feature/initial-code)

# Backend-NEXT
Backend API server for ATLauncher NEXT.

## Installation
Before you begin you need to make sure you have the latest LTS version of NodeJS (6.*) installed on your computer.

**NOTE:** This repository is **NOT** compatible with Yarn. Please don't attempt to use Yarn as there are some issues. Support will not be given with Yarn.

You will also want to make sure you've setup your system for NodeGyp by following their [install docs](https://github.com/nodejs/node-gyp#installation) for your system.

Clone the repository and run the following commands under your project root:

```shell
npm install
```

Once done you need to run the migrations. In development mode (which is default) the application will use a sqlite database at `/db/development.sqlite3`.

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

You can run `npm run test:clean` which will remove the test database, run the migrations as well as the seeds.

### Linting
Please make sure you run all your code through the linter before creating a pull request as all pull requests are automatically checked by the CI process and will cause delays if not linted properly.

To run the linter:

```shell
npm run lint
```

## Configuration
All configuration files can be found in the `/config` folder.

They're divided up into 3 main files:

 - `base.json`: This file is the very base file and contains configuration that is used in both production and development.
 - `test.json`: This file contains setting overrides for when in test.
 - `development.json`: This file contains setting overrides for when in development.
 - `production.json`: This file contains setting overrides for when in prodution.

## Running in production
To run in production you should use some tool such as NodeMon or Forever to keep your server up and running all the time.

First thing you need to do is run the migrations for the production environment:

```shell
NODE_ENV=production npm run migrate
```

This will run the migrations on the defined production database specified in `/knexfile.js` which by default is set to use MySQL using the credentials in the production config.

Then once ready to run simply run:

```shell
NODE_ENV=production npm start
```

This will compile all the src files with babel and then run the server.

## Contributing
If you wish to contribute to this repository in any way, take a look at [CONTRIBUTING.md](CONTRIBUTING.md).