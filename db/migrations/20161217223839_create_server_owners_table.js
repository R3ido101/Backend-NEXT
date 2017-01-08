exports.up = function (knex) {
    return knex.schema.createTable('server_owners', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('server_id', 36).notNullable();
        table.string('user_id', 36).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['host', 'port']);

        // foreign keys
        table.foreign('server_id').references('id').inTable('servers').onDelete('cascade').onUpdate('cascade');
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('server_owners');
};