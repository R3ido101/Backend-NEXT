import { Model } from 'objection';

import BaseModel from './BaseModel';

class File extends BaseModel {
    static tableName = 'files';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'hash', 'size'],

        properties: {
            id: {type: 'integer', minimum: 1},
            name: {type: 'string', maxLength: 1024},
            hash: {type: 'string', minLength: 40, maxLength: 40},
            size: {type: 'integer', minimum: 1},
            mod_id: {type: ['integer', 'null'], minimum: 1, default: null},
            mod_version_id: {type: ['integer', 'null'], minimum: 1, default: null},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        mod: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Mod`,
            join: {
                from: 'files.mod_id',
                to: 'mods.id'
            }
        },
        modVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/ModVersion`,
            join: {
                from: 'files.mod_version_id',
                to: 'mod_versions.id'
            }
        }
    };
}

export default File;