exports.up = function (knex) {
    return knex.schema.createTable('pack_versions', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('pack_id', 36).unsigned().notNullable();
        table.string('minecraft_version_id', 36).nullable().defaultTo(null);
        table.string('published_revision_id', 36).nullable().defaultTo(null);
        table.string('version', 64).index().notNullable();
        table.boolean('is_published').notNullable().defaultTo(false);
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