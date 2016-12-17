import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackDirectory extends BaseModel {
    static tableName = 'pack_directories';

    static jsonSchema = {
        type: 'object',

        required: ['name'],

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_id: {type: 'integer', minimum: 1},
            name: {type: 'string', minLength: 1, maxLength: 32},
            parent: {type: ['integer', 'null'], minimum: 1, default: null},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_directories.pack_id',
                to: 'packs.id'
            }
        },
        parent: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackDirectory`,
            join: {
                from: 'pack_directories.parent',
                to: 'pack_directories.id'
            }
        }
    };
}

export default PackDirectory;