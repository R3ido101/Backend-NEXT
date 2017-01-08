exports.up = function (knex) {
    return knex.schema.createTable('pack_tags', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('tag', 128).index().notNullable();
        table.string('pack_id', 36).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['tag', 'pack_id']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_tags');
};