import { Model } from 'objection';
import BaseModel from './BaseModel';

class Role extends BaseModel {
    static tableName = 'roles';

    static jsonSchema = {
        type: 'object',

        required: ['name', 'description'],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            name: {type: 'string', minLength: 3, maxLength: 255},
            description: {type: 'string'},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        users: {
            relation: Model.ManyToManyRelation,
            modelClass: `${__dirname}/User`,
            join: {
                from: 'roles.id',
                through: {
                    from: 'user_roles.role_id',
                    to: 'user_roles.user_id',
                    modelClass: `${__dirname}/pivots/UserRole`
                },
                to: 'users.id'
            }
        }
    };
}

export default Role;