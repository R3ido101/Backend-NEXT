import { Model } from 'objection';

import BaseModel from './BaseModel';
/**
 * This represents a single version of Minecraft. It includes the JSON for the version as defined by Mojang.
 *
 * @see ../../../db/migrations/20160924191637_minecraft_versions.js
 * @extends ./BaseModel
 */
class MinecraftVersion extends BaseModel {
    static tableName = 'minecraft_versions';

    static jsonAttributes = ['json'];

    static jsonSchema = {
        type: 'object',

        required: ['version'],

        uniqueProperties: ['version'],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            version: {type: 'string', minLength: 5, maxLength: 16},
            json: {type: ['string', 'null'], default: null},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        packVersions: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'minecraft_versions.id',
                to: 'pack_versions.minecraft_version_id'
            }
        }
    };
}

export default MinecraftVersion;