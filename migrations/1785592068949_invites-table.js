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
  pgm.createType("invite_status", [
    "pending",
    "accepted",
    "declined",
    "expired",
  ]);

  pgm.createTable(
    "invites",
    {
      id: {
        type: "uuid",
        primaryKey: true,
        default: pgm.func("gen_random_uuid()"),
      },

      startup_id: {
        type: "uuid",
        references: "startups(id)",
        notNull: true,
        onDelete: "CASCADE",
      },

      user_id: {
        type: "uuid",
        references: "users(id)",
        notNull: true,
        onDelete: "CASCADE",
      },

      invited_by: {
        type: "uuid",
        references: "users(id)",
        notNull: true,
        onDelete: "CASCADE",
      },

      status: {
        type: "invite_status",
        notNull: true,
        default: "pending",
      },
    },
    {
      constraints: {
        unique: [["startup_id", "user_id"]],
      },
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("invites");
  pgm.dropType("invite_status");
};
