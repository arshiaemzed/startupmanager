const db = require("../../database/db");

async function createTestStartup(name, description, owner) {
  const query = await db.query(
    `
        INSERT INTO startups 
        (name, description, owner)
        VALUES($1, $2, $3)
        RETURNING *;
    `,
    [name, description, owner],
  );

  return query.rows[0];
}

module.exports = {
  createTestStartup,
};
