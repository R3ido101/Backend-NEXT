exports.up = function (knex) {
    return knex.schema.createTable('oauth_refresh_tokens', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.integer('access_token_id').unsigned().notNullable();
        table.string('refresh_token', 60).index().unique().notNullable();
        table.text('scope').notNullable();
        table.boolean('revoked').notNullable().defaultTo(false);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
        table.timestamp('expires_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('access_token_id').references('id').inTable('oauth_access_tokens').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('oauth_refresh_tokens');
};