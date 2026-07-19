const db = require("../database/db");

async function getUserInvites(userId) {
  const query = await db.query(
    `
    SELECT 
        invites.id,
        invites.startup_id,
        invites.user_id,
        invites.invited_by,
        invites.invited_at,
        invites.status,
        startups.name AS startup_name,
        users.name AS invited_by_name
    FROM invites
    JOIN startups 
        ON startups.id = invites.startup_id
    JOIN users
        ON users.id = invites.invited_by
    WHERE invites.user_id = $1;
    `,
    [userId],
  );

  return query.rows;
}

async function acceptInvite(inviteId, startupId, userId) {
  const client = await db.connect();

  try {
    await client.query("BEGIN;");

    const deleteInviteQuery = await client.query(
      "DELETE FROM invites WHERE id = $1 AND startup_id = $2 AND user_id = $3 AND status = 'pending'",
      [inviteId, startupId, userId],
    );

    const joinStartupQuery = await client.query(
      "INSERT INTO startup_users (startup_id, user_id, role) VALUES($1, $2, 'worker')",
      [startupId, userId],
    );

    await client.query("COMMIT;");
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    await client.release();
  }
}

async function declineInvite(inviteId, startupId, userId) {
  const query = await db.query(
    "DELETE FROM invites WHERE id = $1 AND startup_id = $2 AND user_id = $3",
    [inviteId, startupId, userId],
  );

  return query.rows[0];
}

async function verifyInvite(inviteId, startupId, userId) {
  const query = await db.query(
    "SELECT * FROM invites WHERE id = $1 AND startup_id = $2 AND user_id = $3 AND status = 'pending'",
    [inviteId, startupId, userId],
  );

  return query.rowCount > 0;
}

async function isUserInStartup(startupId, userId) {
  const query = await db.query(
    "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
    [startupId, userId],
  );

  return query.rowCount > 0;
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

module.exports = {
  getUserInvites,
  acceptInvite,
  declineInvite,
  verifyInvite,
  isUserInStartup,
  userAlreadyInvited,
  inviteUserToStartup,
};
