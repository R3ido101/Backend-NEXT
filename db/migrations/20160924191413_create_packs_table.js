exports.up = function (knex) {
    return knex.schema.createTable('packs', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('name', 255).notNullable().unique();
        table.string('safe_name', 255).notNullable().unique();
        table.text('description').nullable().defaultTo(null);
        table.integer('position').unsigned().notNullable();
        table.boolean('is_disabled').notNullable().defaultTo(true);
        table.string('discord_invite_code', 32).nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
        table.timestamp('disabled_at').nullable().defaultTo(null);

        // indexes
        table.index('name');
        table.index('safe_name');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('packs');
};