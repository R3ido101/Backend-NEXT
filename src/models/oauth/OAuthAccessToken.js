import { Model } from 'objection';
import BaseModel from '../BaseModel';

class OAuthAccessToken extends BaseModel {
    static tableName = 'oauth_access_tokens';

    static jsonSchema = {
        type: 'object',

        required: ['user_id', 'client_id', 'access_token', 'scope', 'expires_at'],

        properties: {
            id: {type: 'integer', minimum: 1},
            user_id: {type: 'integer', minimum: 1},
            client_id: {type: 'integer', minimum: 1},
            access_token: {type: 'string', minLength: 60, maxLength: 60},
            scope: {type: 'string'},
            revoked: {type: 'boolean', default: false},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            expires_at: {type: 'string', format: 'date-time'}
        }
    };

    static relationMappings = {
        client: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/OAuthClient`,
            join: {
                from: 'oauth_access_tokens.user_id',
                to: 'oauth_clients.id'
            }
        },
        refresh_token: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/OAuthRefreshToken`,
            join: {
                from: 'oauth_access_tokens.id',
                to: 'oauth_refresh_tokens.refresh_token_id'
            }
        },
        user: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'oauth_access_tokens.user_id',
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
        revoked: (input) => (!!input),
        scope: (input) => (input.split(','))
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

    /**
     * Checks to see if this access token has the provided scope or not.
     *
     * @param {string} scope
     * @returns {boolean}
     */
    hasScope(scope) {
        if (!this.scope || !this.scope.length) {
            return false;
        }

        const validScopes = this.scope.filter((name) => (name === scope));

        return validScopes.length;
    }
}

export default OAuthAccessToken;