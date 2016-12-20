import { Model, ValidationError } from 'objection';

class BaseModel extends Model {
    /**
     * If we should update the created_at attribute when inserted and the updated_at attribute when updated.
     *
     * @type {boolean}
     */
    static timestamps = true;

    /**
     * An object of attribute names with function values to transform attributes on the model if they exist.
     *
     * @type {object}
     */
    static transforms = {};

    /**
     * Ran before inserting into the database.
     *
     * It will:
     *   - add the created_at field if timestamps are enabled
     *   - check to make sure there are no duplicates values in the database as defined in the jsonSchema.uniqueProperties value
     *
     * @param queryContext
     */
    $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);

        if (this.constructor.timestamps) {
            this.created_at = new Date().toJSON();
        }

        const uniqueProperties = this.constructor.jsonSchema && this.constructor.jsonSchema.uniqueProperties || [];

        return Promise.all(uniqueProperties.map((property) => {
            return new Promise((resolve, reject) => {
                if (this.hasOwnProperty(property)) {
                    this.constructor.query().select('id').where(property, this[property]).first().then((row) => {
                        if (row) {
                            return reject(new ValidationError({
                                [property]: `${property} is already taken.`
                            }));
                        }

                        return resolve();
                    }).catch(reject);
                }
            });
        }));
    }

    /**
     * Ran before updating the database.
     *
     * It will:
     *   - change the updated_at field if timestamps are enabled
     *   - check to make sure there are no duplicates values in the database as defined in the jsonSchema.uniqueProperties value
     *
     * @param queryContext
     */
    $beforeUpdate(queryContext) {
        super.$beforeUpdate(queryContext);

        if (this.constructor.timestamps) {
            this.updated_at = new Date().toJSON();
        }

        const uniqueProperties = this.constructor.jsonSchema && this.constructor.jsonSchema.uniqueProperties || [];

        return Promise.all(uniqueProperties.map((property) => {
            return new Promise((resolve, reject) => {
                if (this.hasOwnProperty(property)) {
                    this.constructor.query().select('id').where(property, this[property]).whereNot('id', queryContext.old.id).first().then((row) => {
                        if (row) {
                            return reject(new ValidationError({
                                [property]: `${property} is already taken.`
                            }));
                        }

                        return resolve();
                    }).catch(reject);
                }
            });
        }));
    }

    /**
     * Ran after querying the database and transforming to the Model.
     *
     * @param {object} json
     * @returns {object}
     */
    $parseDatabaseJson(json) {
        json = super.$parseDatabaseJson.call(this, json);

        Object.keys(this.constructor.transforms).forEach((key) => {
            if (json.hasOwnProperty(key)) {
                json[key] = this.constructor.transforms[key](json[key]);
            }
        });

        return json;
    }
}

export default BaseModel;