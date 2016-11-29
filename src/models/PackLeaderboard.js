import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackLeaderboard extends BaseModel {
    static tableName = 'pack_leaderboards';

    static jsonSchema = {
        type: 'object',

        required: ['username', 'time_played'],

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_id: {type: 'integer', minimum: 1},
            pack_version_id: {type: 'integer', minimum: 1},
            user_id: {type: 'integer', minimum: 1, default: null},
            username: {type: 'string', maxLength: 64},
            time_played: {type: 'integer', minimum: 1, default: 1},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/User`,
            join: {
                from: 'pack_leaderboards.user_id',
                to: 'users.id'
            }
        },
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_leaderboards.pack_id',
                to: 'packs.id'
            }
        },
        packVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'pack_leaderboards.pack_version_id',
                to: 'pack_versions.id'
            }
        }
    };
}

export default PackLeaderboard;