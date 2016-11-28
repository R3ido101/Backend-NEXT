import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackVersion extends BaseModel {
    static tableName = 'pack_versions';

    static jsonSchema = {
        type: 'object',

        required: ['version'],

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_id: {type: 'integer', minimum: 1},
            minecraft_version_id: {type: ['integer', 'null'], minimum: 1, default: null},
            published_revision_id: {type: ['integer', 'null'], minimum: 1, default: null},
            version: {type: 'string', minLength: 3, maxLength: 64},
            changelog: {type: ['string', 'null'], default: null},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            published_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        minecraftVersion: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/MinecraftVersion`,
            join: {
                from: 'pack_versions.minecraft_version_id',
                to: 'minecraft_versions.id'
            }
        },
        pack: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'pack_versions.pack_id',
                to: 'packs.id'
            }
        },
        publishedRevision: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/PackVersionRevision`,
            join: {
                from: 'pack_versions.published_revision_id',
                to: 'pack_version_revisions.id'
            }
        },
        revisions: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackVersionRevision`,
            join: {
                from: 'pack_versions.id',
                to: 'pack_version_revisions.pack_id'
            }
        }
    };
}

export default PackVersion;