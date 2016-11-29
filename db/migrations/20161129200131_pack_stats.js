exports.up = function (knex) {
    return knex.schema.createTable('pack_stats', function (table) {
        // table structure
        table.increments('id').unsigned().primary();
        table.integer('pack_id').unsigned().notNullable();
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