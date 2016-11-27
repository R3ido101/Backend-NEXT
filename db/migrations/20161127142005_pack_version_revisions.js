exports.up = function (knex) {
    return knex.schema.createTable('pack_version_revisions', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.integer('pack_version_id').unsigned().notNullable();
        table.string('hash', 40).notNullable();
        table.jsonb('json').notNullable();
        table.boolean('is_verified').notNullable().defaultTo(false);
        table.boolean('is_verifying').notNullable().defaultTo(false);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('verified_at').nullable().defaultTo(null);

        // indexes
        table.unique(['pack_version_id', 'hash']);

        // foreign keys
        table.foreign('pack_version_id').references('id').inTable('pack_versions').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_version_revisions');
};