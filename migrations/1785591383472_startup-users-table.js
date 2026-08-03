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
  pgm.createType("role_type", ["owner", "admin", "worker"]);

  pgm.createTable(
    "startup_users",
    {
      id: {
        type: "uuid",
        primaryKey: true,
        default: pgm.func("gen_random_uuid()"),
      },

      startup_id: {
        type: "uuid",
        notNull: true,
        references: "startups(id)",
        onDelete: "CASCADE",
      },

      user_id: {
        type: "uuid",
        notNull: true,
        references: "users(id)",
        onDelete: "CASCADE",
      },

      role: {
        type: "role_type",
        notNull: true,
        default: "worker",
      },

      joined_on: {
        type: "timestamptz",
        notNull: true,
        default: pgm.func("now()"),
      },
    },
    {
      constraints: {
        unique: [["startup_id", "user_id"]],
      },
    },
  );

  pgm.createIndex("startup_users", ["startup_id", "user_id"]);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("startup_users");
  pgm.dropType("role_type");
};
