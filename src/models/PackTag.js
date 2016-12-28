import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * Pack Tag's allow for pack developers to tag their packs with tags, allowing users to be able to search packs by tags.
 *
 * Packs can have up to 30 tags and cannot repeat the same tags.
 *
 * Tags can only consist of letters, numbers, dashes, underscores and colons.
 *
 * @see ../../db/migrations/20160924191613_pack_tags.js
 * @extends ./BaseModel
 */
class PackTag extends BaseModel {
    static tableName = 'pack_tags';

    static jsonSchema = {
        type: 'object',

        required: ['tag'],

        uniqueProperties: [['pack_id', 'tag']],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            tag: {type: 'string', minLength: 3, maxLength: 128, pattern: '^[A-Za-z0-9-_:]+$'},
            pack_id: {type: 'integer', minimum: 1},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_tags.pack_id',
                to: 'packs.id'
            }
        }
    };
}

export default PackTag;