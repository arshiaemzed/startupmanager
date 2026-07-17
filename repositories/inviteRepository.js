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

module.exports = {
  getUserInvites,
};
