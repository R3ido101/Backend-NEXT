import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * This contains all the votes for a Server.
 *
 * @see ./Server
 * @extends ./BaseModel
 */
class ServerVote extends BaseModel {
    static tableName = 'server_votes';

    static jsonSchema = {
        type: 'object',

        required: ['username'],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            server_id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            username: {type: 'string', maxLength: 32},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        server: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Server`,
            join: {
                from: 'server_votes.server_id',
                to: 'servers.id'
            }
        }
    };
}

export default ServerVote;