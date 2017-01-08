exports.up = function (knex) {
    return knex.schema.createTable('pack_users', function (table) {
        // table structure
        table.string('id', 36).primary();
        table.string('user_id', 36).notNullable();
        table.string('pack_id', 36).notNullable();
        table.boolean('can_administrate').notNullable().defaultTo(true);
        table.boolean('can_create').notNullable().defaultTo(true);
        table.boolean('can_delete').notNullable().defaultTo(true);
        table.boolean('can_edit').notNullable().defaultTo(true);
        table.boolean('can_publish').notNullable().defaultTo(true);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').nullable().defaultTo(null);

        // indexes
        table.unique(['user_id', 'pack_id']);

        // foreign keys
        table.foreign('pack_id').references('id').inTable('packs').onDelete('cascade').onUpdate('cascade');
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('pack_users');
};