import { Model } from 'objection';

import BaseModel from './BaseModel';

class ModVersion extends BaseModel {
    static tableName = 'mod_versions';

    static jsonSchema = {
        type: 'object',

        required: ['version'],

        properties: {
            id: {type: 'integer', minimum: 1},
            mod_id: {type: 'integer', minimum: 1},
            version: {type: 'string', minLength: 1, maxLength: 64},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        mod: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Mod`,
            join: {
                from: 'mod_versions.mod_id',
                to: 'mods.id'
            }
        }
    };
}

export default ModVersion;