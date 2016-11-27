exports.up = function (knex) {
    return knex.schema.createTable('pack_versions', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.integer('pack_id').unsigned().notNullable();
        table.integer('minecraft_version_id').unsigned().nullable().defaultTo(null);
        table.integer('published_revision_id').unsigned().nullable().defaultTo(null);
        table.string('version', 64).index().notNullable();
        table.text('changelog').nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);
        table.timestamp('published_at').nullable().defaultTo(null);

        // indexes
        table.unique(['pack_id', 'version']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
        table.foreign('minecraft_version_id').references('id').inTable('minecraft_versions').onDelete('cascade').onUpdate('cascade');
        table.foreign('published_revision_id').references('id').inTable('pack_version_revisions').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_versions');
};