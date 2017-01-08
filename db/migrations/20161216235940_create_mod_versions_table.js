exports.up = function (knex) {
    return knex.schema.createTable('mod_versions', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('mod_id', 36).notNullable();
        table.string('version', 64).notNullable();
        table.text('changelog').notNullable();
        table.text('java_versions').nullable().defaultTo(null);
        table.text('minecraft_versions').nullable().defaultTo(null);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // foreign keys
        table.foreign('mod_id').references('id').inTable('mods').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('mod_versions');
};