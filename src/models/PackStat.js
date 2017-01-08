import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A PackStat is a summary of the stats for a Pack for a date.
 *
 * @see ./Pack
 * @extends ./BaseModel
 */
class PackStat extends BaseModel {
    static tableName = 'pack_stats';

    static timestamps = false;

    static jsonSchema = {
        type: 'object',

        required: ['date'],

        uniqueProperties: [['pack_id', 'date']],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            pack_id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            date: {type: 'string', format: 'date'},
            pack_installs: {type: 'integer', minimum: 0, default: 0},
            pack_updates: {type: 'integer', minimum: 0, default: 0},
            server_installs: {type: 'integer', minimum: 0, default: 0},
            server_updates: {type: 'integer', minimum: 0, default: 0},
            time_played: {type: 'integer', minimum: 0, default: 0}
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