/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType("task_status", ["todo", "in_progress", "done"]);

  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    name: {
      type: "varchar(255)",
      notNull: true,
    },

    description: {
      type: "varchar(255)",
      notNull: true,
    },

    startup_id: {
      type: "uuid",
      notNull: true,
      references: "startups(id)",
      onDelete: "CASCADE",
    },

    assigned_to: {
      type: "uuid",
      references: "users(id)",
      onDelete: "CASCADE",
    },

    status: {
      type: "task_status",
      notNull: true,
      default: "todo",
    },

    task_order: {
      type: "smallint",
      notNull: true,
      default: -1,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("tasks");
  pgm.dropType("task_status");
};
