import { Model } from 'objection';

import BaseModel from './BaseModel';

class ServerFeaturedHistory extends BaseModel {
    static tableName = 'server_featured_history';

    static timestamps = false;

    static jsonSchema = {
        type: 'object',

        required: ['transaction_id', 'days', 'price', 'expires_at'],

        properties: {
            id: {type: 'integer', minimum: 1},
            server_id: {type: 'integer', minimum: 1},
            user_id: {type: 'integer', minimum: 1},
            transaction_id: {type: 'string', minLength: 1, maxLength: 32},
            days: {type: 'integer', minimum: 1, maximum: 365},
            price: {type: 'number'},
            created_at: {type: 'string', format: 'date-time'},
            expires_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        server: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Server`,
            join: {
                from: 'server_featured_history.server_id',
                to: 'servers.id'
            }
        },
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/User`,
            join: {
                from: 'server_featured_history.user_id',
                to: 'users.id'
            }
        }
    };
}

export default ServerFeaturedHistory;