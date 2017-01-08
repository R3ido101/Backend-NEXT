exports.up = function (knex) {
    return knex.schema.createTable('pack_files', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('name', 1024).unsigned().notNullable();
        table.string('pack_id', 36).notNullable();
        table.string('pack_directory_id', 36).nullable().defaultTo(null);
        table.string('file_id', 36).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['pack_id', 'name', 'pack_directory_id']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
        table.foreign('file_id').references('id').inTable('files').onDelete('cascade').onUpdate('cascade');
        table.foreign('pack_directory_id').references('id').inTable('pack_directories').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_files');
};