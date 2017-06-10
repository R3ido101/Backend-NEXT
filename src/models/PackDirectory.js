import { Model, ValidationError } from 'objection';

import BaseModel from './BaseModel';

/**
 * A Pack Directory is part of a packs virtual directory structure. It is a directory which contains PackFile's.
 *
 * A PackDirectory can optionally have a parent. If a parent is not defined then it is virtually in the root directory
 * of the file structure. If it has a parent then it must point to another PackDirectory within the same pack. There
 * is no limit the the amount of levels of structure.
 *
 * @see PackFile
 * @extends BaseModel
 */
class PackDirectory extends BaseModel {
    static tableName = 'pack_directories';

    static jsonSchema = {
        type: 'object',

        required: ['name'],

        uniqueProperties: [['pack_id', 'name', 'parent']],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            pack_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            name: {
                type: 'string',
                maxLength: 32,
            },
            parent: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            created_at: {
                type: 'string',
                format: 'date-time',
            },
            updated_at: {
                type: ['string', 'null'],
                format: 'date-time',
                default: null,
            },
        },
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_directories.pack_id',
                to: 'packs.id',
            },
        },
        parent: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackDirectory`,
            join: {
                from: 'pack_directories.parent',
                to: 'pack_directories.id',
            },
        },
    };

    /**
     * Before inserting make sure if a parent is set that it belongs to the same pack.
     *
     * @param {object} queryContext
     */
    async $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);

        if (this.parent) {
            const parentDirectory = await PackDirectory.query().select('pack_id').where('id', this.parent).first();

            if (parentDirectory.pack_id !== this.pack_id) {
                throw new ValidationError('Parent cannot belong to a different pack.');
            }
        }
    }
}

export default PackDirectory;
