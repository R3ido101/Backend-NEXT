import BaseModel from '../BaseModel';

class OAuthScope extends BaseModel {
    static tableName = 'oauth_scopes';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'description'],

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            name: {
                type: 'string',
                minLength: 3,
                maxLength: 255,
            },
            description: {
                type: 'string',
                minLength: 3,
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

    /**
     * This checks the given array of scopes and checks if they're all valid or not.
     *
     * @param {string[]} scopes
     * @returns {boolean}
     */
    static async isValidScopes(scopes = []) {
        if (!scopes.length) {
            return false;
        }

        const validScopes = await this.query().select('name');

        // get all the invalid scopes
        const invalidScopes = scopes.filter((scope) => (
            validScopes.filter((validScope) => (validScope.name === scope)).length === 0
        ));

        // if there are any invalid scopes, then return false
        return invalidScopes.length === 0;
    }
}

export default OAuthScope;
