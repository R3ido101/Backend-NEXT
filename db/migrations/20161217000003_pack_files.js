exports.up = function (knex) {
    return knex.schema.createTable('pack_files', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.integer('pack_id').unsigned().notNullable();
        table.integer('pack_directory_id').unsigned().nullable().defaultTo(null);
        table.integer('file_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['pack_id', 'file_id', 'directory_id']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
        table.foreign('file_id').references('id').inTable('files').onDelete('cascade').onUpdate('cascade');
        table.foreign('pack_directory_id').references('id').inTable('pack_directories').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_files');
};