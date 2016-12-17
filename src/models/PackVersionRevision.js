import sha1 from 'sha1';
import { Model } from 'objection';

import BaseModel from './BaseModel';

class PackVersionRevision extends BaseModel {
    static tableName = 'pack_version_revisions';

    static jsonSchema = {
        type: 'object',

        required: ['json'],

        properties: {
            id: {type: 'integer', minimum: 1},
            pack_version_id: {type: 'integer', minimum: 1},
            hash: {type: 'string', minLength: 40, maxLength: 40},
            json: {type: 'string'},
            is_verified: {type: 'boolean', default: false},
            is_verifying: {type: 'boolean', default: false},
            created_at: {type: 'string', format: 'date-time'},
            verified_at: {type: ['string', 'null'], format: 'date-time', default: null}
        }
    };

    static relationMappings = {
        packVersion: {
            relation: Model.HasOneRelation,
            modelClass: `${__dirname}/PackVersion`,
            join: {
                from: 'pack_version_revisions.pack_version_id',
                to: 'pack_versions.id'
            }
        }
    };

    /**
     * Transform the must_change_password field into a boolean.
     *
     * @type {object}
     */
    static transforms = {
        is_verified: (input) => (!!input),
        is_verifying: (input) => (!!input)
    };

    /**
     * Before inserting make sure we generate the hash.
     *
     * @param {object} queryContext
     */
    $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);

        this.hash = sha1(this.json);
    }

    /**
     * Before updating make sure we generate the hash.
     *
     * @param {object} queryContext
     */
    $beforeUpdate(queryContext) {
        super.$beforeUpdate(queryContext);

        this.hash = sha1(this.json);
    }
}

export default PackVersionRevision;