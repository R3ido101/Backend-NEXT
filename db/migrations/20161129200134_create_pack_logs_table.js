exports.up = function (knex) {
    return knex.schema.createTable('pack_logs', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('pack_id', 36).nullable().defaultTo(null);
        table.string('pack_version_id', 36).nullable().defaultTo(null);
        table.string('username', 16).index().notNullable();
        table.string('action', 32).index().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('SET NULL').onUpdate('cascade');
        table.foreign('pack_version_id').references('id').inTable('pack_versions').onDelete('SET NULL').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_logs');
};