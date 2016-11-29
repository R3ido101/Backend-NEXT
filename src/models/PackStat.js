import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackStat extends BaseModel {
    static tableName = 'pack_stats';

    static jsonSchema = {
        type: 'object',

        required: ['date'],

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_id: {type: 'integer', minimum: 1},
            date: {type: 'string', format: 'date'},
            pack_installs: {type: 'integer', minimum: 0, default: 0},
            pack_updates: {type: 'integer', minimum: 0, default: 0},
            server_installs: {type: 'integer', minimum: 0, default: 0},
            server_updates: {type: 'integer', minimum: 0, default: 0},
            time_played: {type: 'integer', minimum: 0, default: 0},
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_stats.pack_id',
                to: 'packs.id'
            }
        }
    };
}

export default PackStat;