import BaseModel from './BaseModel';

class Setting extends BaseModel {
    static tableName = 'settings';

    static jsonAttributes = ['value'];

    static jsonSchema = {
        type: 'object',

        required: ['username', 'action'],

        properties: {
            id: {type: 'integer', minimum: 1},
            key: {type: 'string', maxLength: 255},
            value: {type: 'string'},
            created_at: {type: 'string', format: 'date-time'}
        }
    };
}

export default Setting;