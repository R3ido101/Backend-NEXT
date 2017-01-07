exports.up = function (knex) {
    return knex.schema.createTable('user_roles', function (table) {
        // table structure
        table.increments('id').primary();
        table.integer('role_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

        // indexes
        table.unique(['user_id', 'role_id']);

        // foreign keys
        table.foreign('role_id').references('id').inTable('roles').onDelete('cascade').onUpdate('cascade');
        table.foreign('user_id').references('id').inTable('users').onDelete('cascade').onUpdate('cascade');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('user_roles');
};