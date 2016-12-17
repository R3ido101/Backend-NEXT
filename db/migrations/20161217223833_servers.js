exports.up = function (knex) {
    return knex.schema.createTable('servers', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('name', 512).notNullable();
        table.string('host', 255).notNullable();
        table.integer('port').notNullable();
        table.text('description').notNullable();
        table.integer('pack_id').unsigned().notNullable();
        table.integer('pack_version_id').unsigned().notNullable();
        table.text('banner_url').nullable().defaultTo(null);
        table.text('website_url').nullable().defaultTo(null);
        table.string('discord_invite_code', 32).nullable().defaultTo(null);
        table.string('votifier_host', 255).nullable().defaultTo(null);
        table.integer('votifier_port').nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);

        // indexes
        table.unique(['host', 'port']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
        table.foreign('pack_version_id').references('id').inTable('pack_versions').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('servers');
};