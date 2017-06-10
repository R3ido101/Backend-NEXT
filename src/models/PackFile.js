import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A PackFile is a virtual file on the system which is stored inside a PackDirectory and is defined as a File but with a
 * unique name.
 *
 * @see File
 * @see PackDirectory
 * @extends BaseModel
 */
class PackFile extends BaseModel {
    static tableName = 'pack_files';

    static jsonSchema = {
        type: 'object',

        uniqueProperties: [['pack_id', 'pack_directory_id', 'name']],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            name: {
                type: 'string',
                maxLength: 1024,
            },
            pack_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            pack_directory_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            file_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
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
                from: 'pack_files.pack_id',
                to: 'packs.id',
            },
        },
        directory: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackDirectory`,
            join: {
                from: 'pack_files.pack_directory_id',
                to: 'pack_directories.id',
            },
        },
        file: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/File`,
            join: {
                from: 'pack_files.file_id',
                to: 'files.id',
            },
        },
    };
}

export default PackFile;
