exports.up = function (knex) {
    return knex.schema.createTable('files', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('hash', 64).index().notNullable();
        table.integer('size').unsigned().notNullable();
        table.string('mod_id', 36).nullable().defaultTo(null);
        table.string('mod_version_id', 36).nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique('hash');

        // foreign keys
        table.foreign('mod_id').references('id').inTable('mods').onDelete('cascade').onUpdate('cascade');
        table.foreign('mod_version_id').references('id').inTable('mod_versions').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('files');
};