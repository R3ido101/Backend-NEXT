import { Model } from 'objection';

import BaseModel from '../BaseModel';

/**
 * This is the pivot table connecting users to roles.
 *
 * Users can only have one of the same role.
 *
 * @see Role
 * @see User
 * @extends BaseModel
 */
class UserRole extends BaseModel {
    static tableName = 'user_roles';

    static jsonSchema = {
        type: 'object',

        required: ['role_id', 'user_id'],

        uniqueProperties: [['role_id', 'user_id']],

        additionalProperties: false,

        properties: {
            id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            role_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            user_id: {
                type: 'string',
                minLength: 36,
                maxLength: 36,
                pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
            },
            created_at: {
                type: 'string',
                format: 'date-time',
            },
        },
    };

    static relationMappings = {
        role: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../Role`,
            join: {
                from: 'user_roles.role_id',
                to: 'roles.id',
            },
        },
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../User`,
            join: {
                from: 'user_roles.user_id',
                to: 'users.id',
            },
        },
    };
}

export default UserRole;
