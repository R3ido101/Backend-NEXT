exports.up = function (knex) {
    return knex.schema.createTable('oauth_scopes', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('name', 255).index().unique().notNullable();
        table.text('description').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('oauth_scopes');
};