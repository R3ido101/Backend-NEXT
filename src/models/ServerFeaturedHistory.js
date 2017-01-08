import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * This contains all the purchases of a featured slot on the servers list.
 *
 * @see ./Server
 * @extends ./BaseModel
 */
class ServerFeaturedHistory extends BaseModel {
    static tableName = 'server_featured_history';

    static jsonSchema = {
        type: 'object',

        required: ['transaction_id', 'days', 'price', 'expires_at'],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            server_id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            user_id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            transaction_id: {type: 'string', maxLength: 32},
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