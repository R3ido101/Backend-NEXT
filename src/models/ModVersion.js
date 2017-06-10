import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A ModVersion is a specific version for a Mod. A ModVersion contains a version string and a changelog for that
 * specific version as well as optionally a list of java and Minecraft versions it's compatible with.
 *
 * @see Mod
 * @extends BaseModel
 */
class ModVersion extends BaseModel {
    static tableName = 'mod_versions';

    static jsonSchema = {
        type: 'object',

        required: ['version', 'changelog'],

        uniqueProperties: [['mod_id', 'version']],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            mod_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            version: {
                type: 'string',
                maxLength: 64,
            },
            java_versions: {
                type: ['array', 'null'],
                items: {type: 'string'},
                default: null,
            },
            minecraft_versions: {
                type: ['array', 'null'],
                items: {type: 'string'},
                default: null,
            },
            changelog: {type: 'string'},
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
                from: 'mod_versions.mod_id',
                to: 'mods.id',
            },
        },
    };
}

export default ModVersion;
