import { Model } from 'objection';
import BaseModel from '../BaseModel';

class OAuthAuthorizationCode extends BaseModel {
    static tableName = 'oauth_authorization_codes';

    static jsonSchema = {
        type: 'object',

        required: ['user_id', 'client_id', 'authorization_code', 'redirect_uri', 'scope', 'expires_at'],

        properties: {
            id: {type: 'integer'},
            user_id: {type: 'integer', minimum: 1},
            client_id: {type: 'integer', minimum: 1},
            authorization_code: {type: 'string'},
            redirect_uri: {type: 'string'},
            scope: {type: 'string'},
            revoked: {type: 'boolean', default: false},
            created_at: {type: ['string', 'null'], format: 'date-time', default: null},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            expires_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        client: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/OAuthClient`,
            join: {
                from: 'oauth_authorization_codes.user_id',
                to: 'oauth_clients.id'
            }
        },
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'oauth_authorization_codes.client_id',
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

export default OAuthAuthorizationCode;