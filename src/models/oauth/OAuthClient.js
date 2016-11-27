import { Model } from 'objection';

import BaseModel from '../BaseModel';

class OAuthClient extends BaseModel {
    static tableName = 'oauth_clients';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'user_id', 'client_id', 'client_secret', 'redirect_uri'],

        properties: {
            id: {type: 'integer', minimum: 1},
            name: {type: 'string', minLength: 3, maxLength: 255},
            user_id: {type: 'integer', minimum: 1},
            client_id: {type: 'string', minLength: 60, maxLength: 60},
            client_secret: {type: 'string', minLength: 60, maxLength: 60},
            redirect_uri: {type: 'string', format: 'uri'},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'oauth_clients.user_id',
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
}

export default OAuthClient;