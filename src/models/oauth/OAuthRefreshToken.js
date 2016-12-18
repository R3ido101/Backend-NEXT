import { Model } from 'objection';
import BaseModel from '../BaseModel';

class OAuthRefreshToken extends BaseModel {
    static tableName = 'oauth_refresh_tokens';

    static jsonSchema = {
        type: 'object',

        required: ['access_token_id', 'refresh_token', 'scope', 'expires_at'],

        properties: {
            id: {type: 'integer', minimum: 1},
            access_token_id: {type: 'integer', minimum: 1},
            refresh_token: {type: 'string', minLength: 60, maxLength: 60},
            scope: {type: 'string'},
            revoked: {type: 'boolean', default: false},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            expires_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        accessToken: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/OAuthAccessToken`,
            join: {
                from: 'oauth_refresh_tokens.access_token_id',
                to: 'oauth_access_tokens.id'
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
     * @param {object} json
     * @param {object} opt
     * @returns {object}
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