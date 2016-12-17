exports.up = function (knex) {
    return knex.schema.createTable('mods', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('name', 255).notNullable();
        table.text('description').notNullable();
        table.text('website_url').nullable().defaultTo(null);
        table.text('donation_url').nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('mods');
};