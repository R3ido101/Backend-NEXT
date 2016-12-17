import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackFile extends BaseModel {
    static tableName = 'pack_files';

    static jsonSchema = {
        type: 'object',

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_id: {type: 'integer', minimum: 1},
            pack_directory_id: {type: ['integer', 'null'], minimum: 1, default: null},
            file_id: {type: 'integer', minimum: 1},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_files.pack_id',
                to: 'packs.id'
            }
        },
        directory: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackDirectory`,
            join: {
                from: 'pack_files.pack_directory_id',
                to: 'pack_directories.id'
            }
        },
        file: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/File`,
            join: {
                from: 'pack_files.file_id',
                to: 'files.id'
            }
        }
    };
}

export default PackFile;