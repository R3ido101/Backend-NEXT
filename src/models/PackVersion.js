import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A PackVersion is a single version of a Pack. PackVersion's are considered in development if the is_published field is
 * true. When it's not null then it's considered a published version.
 *
 * A PackVersion is linked to a single PackVersionRevision which contains a single revision of the PackVersion's JSON.
 *
 * When a pack is published, it makes a clone of the development version and then publishes it. Once a pack is published
 * it's revision cannot be changed.
 *
 * @see Pack
 * @see PackVersionRevision
 * @extends BaseModel
 *
 */
class PackVersion extends BaseModel {
    static tableName = 'pack_versions';

    static jsonSchema = {
        type: 'object',

        required: ['version'],

        uniqueProperties: [['version', 'is_published']],

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
            minecraft_version_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            published_revision_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            version: {
                type: 'string',
                minLength: 3,
                maxLength: 64,
            },
            is_published: {
                type: 'boolean',
                default: false,
            },
            changelog: {
                type: ['string', 'null'],
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
            published_at: {
                type: ['string', 'null'],
                format: 'date-time',
                default: null,
            },
        },
    };

    static relationMappings = {
        minecraftVersion: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/MinecraftVersion`,
            join: {
                from: 'pack_versions.minecraft_version_id',
                to: 'minecraft_versions.id',
            },
        },
        pack: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_versions.pack_id',
                to: 'packs.id',
            },
        },
        publishedRevision: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/PackVersionRevision`,
            join: {
                from: 'pack_versions.published_revision_id',
                to: 'pack_version_revisions.id',
            },
        },
        revisions: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackVersionRevision`,
            join: {
                from: 'pack_versions.id',
                to: 'pack_version_revisions.pack_id',
            },
        },
    };
}

export default PackVersion;
