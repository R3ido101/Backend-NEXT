exports.up = function (knex) {
    return knex.schema.createTable('server_featured_history', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('server_id', 36).notNullable();
        table.string('user_id', 36).notNullable();
        table.string('transaction_id', 19).unsigned().notNullable();
        table.integer('days').unsigned().notNullable();
        table.decimal('price').unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('expires_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('server_id').references('id').inTable('servers').onDelete('cascade').onUpdate('cascade');
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('server_featured_history');
};