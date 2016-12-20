import { Model } from 'objection';

import BaseModel from './BaseModel';

class LauncherTag extends BaseModel {
    static tableName = 'launcher_tags';

    static jsonSchema = {
        type: 'object',

        required: ['tag'],

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
                from: 'launcher_tags.pack_id',
                to: 'packs.id'
            }
        }
    };
}

export default LauncherTag;