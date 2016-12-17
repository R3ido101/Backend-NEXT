import { Model } from 'objection';

import BaseModel from '../BaseModel';

class PackUser extends BaseModel {
    static tableName = 'server_owners';

    static jsonSchema = {
        type: 'object',

        properties: {
            id: {type: 'integer', minimum: 1},
            server_id: {type: 'integer', minimum: 1},
            user_id: {type: 'integer', minimum: 1},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        server: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../Server`,
            join: {
                from: 'server_owners.server_id',
                to: 'servers.id'
            }
        },
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'server_owners.user_id',
                to: 'users.id'
            }
        }
    };
}

export default PackUser;