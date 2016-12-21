import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A file is a single file in the file system. Uploaded by users or automatically by the system.
 *
 * It can be linked to a Mod and a ModVersion, but doesn't have to be linked explicitly to one or both of those.
 *
 * Since all files can hosted externally and not necessarily on the local disk, all file information is cached in the database for speed and for making lookups quicker.
 *
 * The hash property is the only property that must be unique and is the sha1 hash of the file.
 *
 * @see ./Mod
 * @see ./ModVersion
 * @see ../../db/migrations/20161216235950_files.js
 * @extends ./BaseModel
 */
class File extends BaseModel {
    static tableName = 'files';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'hash', 'size'],

        uniqueProperties: ['hash'],

        additionalProperties: false,

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