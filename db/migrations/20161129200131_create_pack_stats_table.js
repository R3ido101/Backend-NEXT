exports.up = function (knex) {
    return knex.schema.createTable('pack_stats', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('pack_id', 36).notNullable();
        table.date('date').notNullable();
        table.integer('pack_installs').unsigned().notNullable().defaultTo(0);
        table.integer('pack_updates').unsigned().notNullable().defaultTo(0);
        table.integer('server_installs').unsigned().notNullable().defaultTo(0);
        table.integer('server_updates').unsigned().notNullable().defaultTo(0);
        table.integer('time_played').unsigned().notNullable().defaultTo(0);

        // indexes
        table.unique(['pack_id', 'date']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_stats');
};