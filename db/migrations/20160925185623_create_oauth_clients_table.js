exports.up = function (knex) {
    return knex.schema.createTable('oauth_clients', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('name', 255).index().notNullable();
        table.integer('user_id').unsigned().index().notNullable();
        table.string('client_id', 80).index().unique().notNullable();
        table.string('client_secret', 80).index().unique().notNullable();
        table.text('redirect_uri').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);

        // foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('oauth_clients');
};