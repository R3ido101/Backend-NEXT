import Vantage from 'vantage';
import { Model } from 'objection';

import knex from '../db';

Model.knex(knex);

import addCommands from './commands';

const vantage = Vantage();

addCommands(vantage);

vantage
    .delimiter('Backend-NEXT~$')
    .listen(80)
    .show();