import { Model } from 'objection';

import BaseModel from './BaseModel';

class ServerHistory extends BaseModel {
    static tableName = 'server_history';

    static jsonSchema = {
        type: 'object',

        required: ['online', 'players'],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            server_id: {type: 'integer', minimum: 1},
            online: {type: 'boolean', default: false},
            players: {type: 'integer', minimum: 0, default: 0},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        server: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Server`,
            join: {
                from: 'server_history.server_id',
                to: 'servers.id'
            }
        }
    };
}

export default ServerHistory;