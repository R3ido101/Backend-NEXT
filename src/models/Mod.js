import { Model } from 'objection';

import BaseModel from './BaseModel';

/**
 * A Mod is a mod. A mod has a name, description, urls and author/s.
 *
 * A mod has many different versions.
 *
 * @see ./ModVersion
 * @extends ./BaseModel
 */
class Mod extends BaseModel {
    static tableName = 'mods';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'description', 'authors'],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            name: {type: 'string', maxLength: 255},
            description: {type: 'string'},
            authors: {type: 'array', items: {type: 'string'}},
            license: {type: ['string', 'null'], default: null},
            website_url: {type: ['string', 'null'], default: null},
            source_url: {type: ['string', 'null'], default: null},
            issues_url: {type: ['string', 'null'], default: null},
            wiki_url: {type: ['string', 'null'], default: null},
            donation_url: {type: ['string', 'null'], default: null},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        versions: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/ModVersion`,
            join: {
                from: 'mods.id',
                to: 'mod_versions.mod_id'
            }
        }
    };
}

export default Mod;