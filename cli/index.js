import Vantage from 'vantage';
import { Model } from 'objection';

import knex from '../db';

Model.knex(knex);

import loadCommands from './loadCommands';

const vantage = Vantage();

loadCommands(vantage);

vantage
    .delimiter('Backend-NEXT~$')
    .listen(80)
    .show();