const db = require("../database/db");

async function searchUsersByNameOrDisplayName(value, limit, offset) {
  const query = await db.query(
    `
      SELECT users.id, users.name, users.user_name FROM users
      WHERE name ILIKE $1
      OR user_name ILIKE $1
      ORDER BY user_name ASC
      LIMIT  $2
      OFFSET $3;
    `,
    [`%${value}%`, limit, offset],
  );

  return query.rows;
}

async function getAllMembers(startupId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1",
    [startupId],
  );

  return query.rows;
}

async function getSpecificMember(startupId, userId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rows[0];
}

async function updateUserRole(startupId, userId, role) {
  const query = await db.query(
    "UPDATE startup_users SET role = $1 WHERE startup_id = $2 AND user_id = $3 RETURNING user_id, startup_id, role",
    [role, startupId, userId],
  );

  return query.rows;
}

async function userAlreadyInvited(startupId, memberId) {
  const query = await db.query(
    `
    SELECT * FROM invites
    WHERE startup_id = $1 AND user_id = $2 AND status = $3
    `,
    [startupId, memberId, "pending"],
  );

  return query.rowCount > 0;
}

async function inviteUserToStartup(startupId, userId, memberId) {
  const query = await db.query(
    `
      INSERT INTO invites 
      (startup_id, invited_by, user_id)
      VALUES ($1, $2, $3);
    `,
    [startupId, userId, memberId],
  );

  return query.rows[0];
}

async function kickMember(startupId, userId) {
  const query = await db.query(
    `
      WITH deleted_member AS (
        DELETE FROM startup_users
        WHERE startup_id = $1 AND user_id = $2
        RETURNING id, startup_id, user_id, role, joined_on
      )
      SELECT 
        deleted_member.id,
        deleted_member.startup_id,
        deleted_member.user_id,
        deleted_member.role,
        deleted_member.joined_on,
        users.name
      FROM deleted_member
        JOIN  users
        ON users.id = deleted_member.user_id;
    
    `,
    [startupId, userId],
  );

  return query.rows[0];
}

module.exports = {
  getAllMembers,
  getSpecificMember,
  updateUserRole,
  kickMember,
  searchUsersByNameOrDisplayName,
  inviteUserToStartup,
  userAlreadyInvited,
};
