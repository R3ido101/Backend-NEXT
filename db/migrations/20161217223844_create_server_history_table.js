exports.up = function (knex) {
    return knex.schema.createTable('server_history', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('server_id', 36).notNullable();
        table.boolean('online').notNullable().defaultTo(false);
        table.integer('players').unsigned().notNullable().defaultTo(0);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('server_id').references('id').inTable('servers').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('server_history');
};