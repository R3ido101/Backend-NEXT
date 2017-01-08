import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * Launcher Tag's allow for ATLauncher staff to tag packs with tags. These tags mean nothing unless specifically searched with in the launcher. For instance having a list of featured packs.
 *
 * Packs can have an unlimited amount of launcher tags but cannot repeat the same tag.
 *
 * Tags can only consist of letters, numbers, dashes, underscores and colons.
 *
 * @extends ./BaseModel
 */
class LauncherTag extends BaseModel {
    static tableName = 'launcher_tags';

    static jsonSchema = {
        type: 'object',

        required: ['tag'],

        uniqueProperties: [['pack_id', 'tag']],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            tag: {type: 'string', minLength: 3, maxLength: 128, pattern: '^[A-Za-z0-9-_:]+$'},
            pack_id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            created_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        pack: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/Pack`,
            join: {
                from: 'launcher_tags.pack_id',
                to: 'packs.id'
            }
        }
    };
}

export default LauncherTag;