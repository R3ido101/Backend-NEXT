import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A Server is a single Server on the server list site.
 *
 * It must collate with a pack and a pack version. If that pack is deleted then this Server is also deleted. If the
 * PackVersion is deleted then it will be set to null.
 *
 * @see Pack
 * @see PackVersion
 * @extends BaseModel
 */
class Server extends BaseModel {
    static tableName = 'servers';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'host', 'description', 'pack_id', 'pack_version_id'],

        uniqueProperties: [['host', 'port']],

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
                maxLength: 512,
            },
            host: {
                type: 'string',
                maxLength: 255,
            },
            port: {
                type: 'integer',
                minimum: 1,
                maximum: 65535,
                default: 25565,
            },
            description: {
                type: 'string',
                minLength: 30,
            },
            pack_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            pack_version_id: {
                type: ['string', 'null'],
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
                default: null,
            },
            banner_url: {
                type: ['string', 'null'],
                default: null,
                maxLength: 1024,
            },
            website_url: {
                type: ['string', 'null'],
                default: null,
                maxLength: 1024,
            },
            discord_invite_code: {
                type: ['string', 'null'],
                default: null,
                maxLength: 32,
            },
            votifier_host: {
                type: ['string', 'null'],
                default: null,
                maxLength: 255,
            },
            votifier_port: {
                type: ['string', 'null'],
                default: null,
                minimum: 1,
                maximum: 65535,
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
                from: 'servers.pack_id',
                to: 'packs.id',
            },
        },
        packVersion: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'servers.pack_version_id',
                to: 'pack_versions.id',
            },
        },
        featuredHistory: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/ServerFeaturedHistory`,
            join: {
                from: 'servers.id',
                to: 'server_featured_history.server_id',
            },
        },
        history: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/ServerHistory`,
            join: {
                from: 'servers.id',
                to: 'server_history.server_id',
            },
        },
        owner: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/User`,
            join: {
                from: 'servers.id',
                through: {
                    from: 'server_owners.server_id',
                    to: 'server_owners.user_id',
                    modelClass: `${__dirname}/pivots/ServerOwner`,
                },
                to: 'users.id',
            },
        },
        votes: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/ServerVote`,
            join: {
                from: 'servers.id',
                to: 'server_votes.server_id',
            },
        },
    };
}

export default Server;
