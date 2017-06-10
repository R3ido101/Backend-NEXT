import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A file is a single file in the file system. Uploaded by users or automatically by the system.
 *
 * It can be linked to a Mod and a ModVersion, but doesn't have to be linked explicitly to one or both of those.
 *
 * Since all files can hosted externally and not necessarily on the local disk, all file information is cached in the
 * database for speed and for making lookups quicker.
 *
 * The hash property is the only property that must be unique and is the sha1 hash of the file.
 *
 * @see Mod
 * @see ModVersion
 * @extends BaseModel
 */
class File extends BaseModel {
    static tableName = 'files';

    static jsonSchema = {
        type: 'object',

        required: ['hash', 'size'],

        uniqueProperties: ['hash'],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            hash: {
                type: 'string',
                minLength: 64,
                maxLength: 64,
            },
            size: {
                type: 'integer',
                minimum: 1,
            },
            mod_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            mod_version_id: {
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
        },
    };

    static relationMappings = {
        mod: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Mod`,
            join: {
                from: 'files.mod_id',
                to: 'mods.id',
            },
        },
        modVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/ModVersion`,
            join: {
                from: 'files.mod_version_id',
                to: 'mod_versions.id',
            },
        },
    };
}

export default File;
