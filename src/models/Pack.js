import { Model } from 'objection';

import BaseModel from './BaseModel';

import { getSafeString } from '../utils';

/**
 * Packs are self explanatory. Packs must have a unique name and a unique safe name (removing all non alphanumeric characters, dashes and underscores).
 *
 * All packs are public and rely on launcher tags to distinguish packs on the launcher.
 *
 * @see ./LauncherTag
 * @extends ./BaseModel
 */
class Pack extends BaseModel {
    static tableName = 'packs';

    static jsonSchema = {
        type: 'object',

        required: ['name'],

        uniqueProperties: ['name', 'safe_name'],

        additionalProperties: false,

        properties: {
            id: {type: 'string', minLength: 36, maxLength: 36, pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'},
            name: {type: 'string', minLength: 3, maxLength: 255},
            safe_name: {type: 'string', minLength: 3, maxLength: 255},
            description: {type: ['string', 'null'], minLength: 3, default: null},
            position: {type: 'integer', minimum: 1},
            is_disabled: {type: 'boolean', default: false},
            discord_invite_code: {type: 'string', minLength: 8, maxLength: 32},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            disabled_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        launcherTags: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/LauncherTag`,
            join: {
                from: 'packs.id',
                to: 'launcher_tags.pack_id'
            }
        },
        packLeaderboards: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackLeaderboard`,
            join: {
                from: 'packs.id',
                to: 'pack_leaderboards.pack_id'
            }
        },
        packLogs: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackLog`,
            join: {
                from: 'packs.id',
                to: 'pack_logs.pack_id'
            }
        },
        packTags: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/PackTag`,
            join: {
                from: 'packs.id',
                to: 'pack_tags.pack_id'
            }
        },
        users: {
            relation: Model.ManyToManyRelation,
            modelClass: `${__dirname}/User`,
            join: {
                from: 'packs.id',
                through: {
                    from: 'pack_users.pack_id',
                    to: 'pack_users.user_id',
                    modelClass: `${__dirname}/pivots/PackUser`
                },
                to: 'users.id'
            }
        }
    };

    /**
     * Before inserting make sure we add in the packs safe name as well as set the position if not set.
     *
     * @param {object} queryContext
     */
    async $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);

        this.safe_name = getSafeString(this.name);

        if (!this.position) {
            const highestPoisitonPack = await Pack.query().select('position').orderBy('position', 'desc').first();

            if (!highestPoisitonPack) {
                this.position = 1;
            } else {
                this.position = (highestPoisitonPack.position + 1);
            }
        }
    }

    /**
     * Before updating make sure we add in the packs safe name.
     *
     * @param {ModelOptions} opt
     * @param {QueryBuilderContext} queryContext
     */
    $beforeUpdate(opt, queryContext) {
        super.$beforeUpdate(opt, queryContext);

        this.safe_name = getSafeString(this.name);
    }

    /**
     * Transform the boolean fields into a boolean.
     *
     * @type {object}
     */
    static transforms = {
        is_disabled: (input) => (!!input)
    };
}

export default Pack;