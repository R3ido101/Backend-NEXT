exports.up = function (knex) {
    return knex.schema.createTable('oauth_access_tokens', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('user_id', 36).notNullable();
        table.string('client_id', 36).notNullable();
        table.string('access_token', 60).unique().notNullable();
        table.text('scope').notNullable();
        table.boolean('revoked').notNullable().defaultTo(false);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
        table.timestamp('expires_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
        table.foreign('client_id').references('id').inTable('oauth_clients').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('oauth_access_tokens');
};