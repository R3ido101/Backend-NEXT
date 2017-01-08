exports.up = function (knex) {
    return knex.schema.createTable('server_votes', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('server_id', 36).notNullable();
        table.string('username', 32).unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('server_id').references('id').inTable('servers').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('server_votes');
};