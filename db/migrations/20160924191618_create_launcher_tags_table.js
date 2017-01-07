exports.up = function (knex) {
    return knex.schema.createTable('launcher_tags', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.string('tag', 128).index().notNullable();
        table.integer('pack_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['tag', 'pack_id']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('launcher_tags');
};