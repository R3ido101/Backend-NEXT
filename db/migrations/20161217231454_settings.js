exports.up = function (knex) {
    return knex.schema.createTable('settings', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('key', 255).index().unsigned().notNullable();
        table.text('value').unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('settings');
};