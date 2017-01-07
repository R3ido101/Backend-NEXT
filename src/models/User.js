import bcrypt from 'bcryptjs';
import { Model } from 'objection';

import Pack from './Pack';
import Role from './Role';
import BaseModel from './BaseModel';
import PackUser from './pivots/PackUser';
import UserRole from './pivots/UserRole';

import { getConfig } from '../config';
import { generateUID } from '../utils';

const config = getConfig();

/**
 * A User represents someone who has signed up for an ATLauncher account. An ATLauncher account is not required to download/install/play packs, but is required to make packs and play some private
 * packs.
 *
 * When users sign up, they will get an email with a link they must click in order to confirm their account and login.
 *
 * @extends ./BaseModel
 */
class User extends BaseModel {
    static tableName = 'users';

    static jsonSchema = {
        type: 'object',

        required: ['username', 'email', 'password'],

        uniqueProperties: ['username', 'email'],

        additionalProperties: false,

        properties: {
            id: {type: 'integer', minimum: 1},
            username: {type: 'string', minLength: 3, maxLength: 64, pattern: '^[A-Za-z0-9-_]+$'},
            email: {type: 'string', format: 'email'},
            password: {type: 'string', maxLength: 60},
            must_change_password: {type: 'boolean', default: false},
            is_banned: {type: 'boolean', default: false},
            ban_reason: {type: ['string', 'null'], default: null},
            is_verified: {type: 'boolean', default: false},
            verification_code: {type: 'string', minLength: 128, maxLength: 128},
            tfa_secret: {type: ['string', 'null'], minLength: 32, maxLength: 32, default: null},
            created_at: {type: 'string', format: 'date-time'},
            updated_at: {type: ['string', 'null'], format: 'date-time', default: null},
            banned_at: {type: ['string', 'null'], format: 'date-time', default: null},
            verified_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        packs: {
            relation: Model.ManyToManyRelation,
            modelClass: Pack,
            join: {
                from: 'users.id',
                through: {
                    from: 'pack_users.user_id',
                    to: 'pack_users.pack_id',
                    modelClass: PackUser,
                    extra: [
                        'can_administrate',
                        'can_create',
                        'can_delete',
                        'can_edit',
                        'can_publish'
                    ]
                },
                to: 'packs.id'
            }
        },
        roles: {
            relation: Model.ManyToManyRelation,
            modelClass: Role,
            join: {
                from: 'users.id',
                through: {
                    from: 'user_roles.user_id',
                    to: 'user_roles.role_id',
                    modelClass: UserRole
                },
                to: 'roles.id'
            }
        }
    };

    /**
     * Transform the must_change_password field into a boolean.
     *
     * @type {object}
     */
    static transforms = {
        is_banned: (input) => (!!input),
        is_verified: (input) => (!!input),
        must_change_password: (input) => (!!input)
    };

    /**
     * Before inserting make sure we hash the password if provided and also add in a verification code.
     *
     * @param {object} queryContext
     */
    $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);

        if (this.hasOwnProperty('password')) {
            this.password = bcrypt.hashSync(this.password, config.bcryptRounds);
        }

        if (!this.hasOwnProperty('verification_code')) {
            this.verification_code = generateUID(128);
        }
    }

    /**
     * Before updating make sure we hash the password if provided.
     *
     * @param {object} queryContext
     */
    $beforeUpdate(queryContext) {
        super.$beforeUpdate(queryContext);

        if (this.hasOwnProperty('password')) {
            this.password = bcrypt.hashSync(this.password, config.bcryptRounds);
        }
    }

    /**
     * Checks to see if this user has the provided role or not.
     *
     * @param {string} role
     * @returns {boolean}
     */
    hasRole(role) {
        if (!this.roles) {
            return false;
        }

        const validRoles = this.roles.filter(({name}) => (name === role));

        return validRoles.length;
    }
}

export default User;