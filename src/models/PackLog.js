import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A PackLog contains actions done by an individual user on a pack. For instance installing the pack, updating it etc.
 *
 * It logs the Pack actioned against as well as the PackVersion. If either of those are deleted, then it will set them to null, keeping the action still logged in the database.
 *
 * @see ./Pack
 * @see ./PackVersion
 * @extends ./BaseModel
 */
class PackLog extends BaseModel {
    static tableName = 'pack_logs';

    static jsonSchema = {
        type: 'object',

        required: ['username', 'action'],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            pack_id: {type: ['string', 'null'], minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', default: null},
            pack_version_id: {type: ['string', 'null'], minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', default: null},
            username: {type: 'string', minLength: 1, maxLength: 16, pattern: '^[a-zA-Z0-9_]{1,16}$'},
            action: {type: 'string', maxLength: 64},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_logs.pack_id',
                to: 'packs.id'
            }
        },
        packVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'pack_logs.pack_version_id',
                to: 'pack_versions.id'
            }
        }
    };
}

export default PackLog;