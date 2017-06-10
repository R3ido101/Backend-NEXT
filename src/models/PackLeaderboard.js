import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A PackLeaderboard contains the time played by an individual user on a pack.
 *
 * It logs the Pack played as well as the PackVersion that was played. If either of those are deleted, then it will set
 * them to null, keeping the time played still in the database.
 *
 * @see Pack
 * @see PackVersion
 * @extends BaseModel
 */
class PackLeaderboard extends BaseModel {
    static tableName = 'pack_leaderboards';

    static jsonSchema = {
        type: 'object',

        required: ['username', 'time_played'],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            pack_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            pack_version_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            username: {
                type: 'string',
                minLength: 1,
                maxLength: 16,
                pattern: '^[a-zA-Z0-9_]{1,16}$',
            },
            time_played: {
                type: 'integer',
                minimum: 1,
                default: 1,
            },
            created_at: {
                type: 'string',
                format: 'date-time',
            },
        },
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_leaderboards.pack_id',
                to: 'packs.id',
            },
        },
        packVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'pack_leaderboards.pack_version_id',
                to: 'pack_versions.id',
            },
        },
    };
}

export default PackLeaderboard;
