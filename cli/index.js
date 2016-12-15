import Vantage from 'vantage';
import { Model } from 'objection';

import knex from '../db';
import { getConfig } from '../config';

const config = getConfig();

Model.knex(knex);

import loadCommands from './loadCommands';

const vantage = Vantage();

loadCommands(vantage);

vantage
    .delimiter('Backend-NEXT~$')
    .listen(config.cli.port)
    .show();