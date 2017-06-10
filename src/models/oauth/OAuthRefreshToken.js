import { Model } from 'objection';
import BaseModel from '../BaseModel';

class OAuthRefreshToken extends BaseModel {
    static tableName = 'oauth_refresh_tokens';

    static jsonSchema = {
        type: 'object',

        required: ['access_token_id', 'refresh_token', 'scope', 'expires_at'],

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            access_token_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            refresh_token: {
                type: 'string',
                minLength: 60,
                maxLength: 60,
            },
            scope: {type: 'string'},
            revoked: {
                type: 'boolean',
                default: false,
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
            expires_at: {
                type: 'string',
                format: 'date-time',
            },
        },
    };

    static relationMappings = {
        accessToken: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/OAuthAccessToken`,
            join: {
                from: 'oauth_refresh_tokens.access_token_id',
                to: 'oauth_access_tokens.id',
            },
        },
    };

    /**
     * Transform the revoked field into a boolean.
     *
     * @type {object}
     */
    static transforms = {
        revoked: (input) => (!!input),
    };

    /**
     * Ran when creating model from Json.
     *
     * @param {object} json
     * @param {object} opt
     * @returns {object}
     */
    $parseJson(json, opt) {
        // eslint-disable-next-line prefer-const
        let updatedJson = super.$parseJson(json, opt);

        if (typeof updatedJson.expires_at !== 'string' && typeof updatedJson.expires_at.toJSON === 'function') {
            updatedJson.expires_at = updatedJson.expires_at.toJSON();
        }

        return updatedJson;
    }
}

export default OAuthRefreshToken;
