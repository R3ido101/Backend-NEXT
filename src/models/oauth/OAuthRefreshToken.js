import { Model } from 'objection';
import BaseModel from '../BaseModel';

class OAuthRefreshToken extends BaseModel {
    static tableName = 'oauth_refresh_tokens';

    static jsonSchema = {
        type: 'object',

        required: ['access_token_id', 'refresh_token', 'scope', 'expires_at'],

        properties: {
            id: {type: 'integer'},
            access_token_id: {type: 'integer', minimum: 1},
            refresh_token: {type: 'string'},
            scope: {type: 'string'},
            revoked: {type: 'boolean', default: false},
            created_at: {type: ['string', 'null'], format: 'date-time', default: null},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            expires_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'oauth_refresh_tokens.user_id',
                to: 'users.id'
            }
        }
    };

    /**
     * Transform the revoked field into a boolean.
     *
     * @type {object}
     */
    static transforms = {
        revoked: (input) => (!!input)
    };

    /**
     * Ran when creating model from Json.
     *
     * @param {Object} json
     * @param {Object} opt
     * @returns {Object}
     */
    $parseJson(json, opt) {
        json = super.$parseJson(json, opt);

        if (json.expires_at && typeof json.expires_at !== 'string' && typeof json.expires_at.toJSON === 'function') {
            json.expires_at = json.expires_at.toJSON();
        }

        return json;
    }
}

export default OAuthRefreshToken;