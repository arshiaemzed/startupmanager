const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createTestStartup } = require("../helpers/startup");

async function createOwnedStartup() {
  const newUser = {
    email: "test@gmail.com",
    password: "test1234",
    name: "Test user",
    userName: "test_user",
  };

  const user = await createTestUser(newUser);

  const token = await createAccessToken(user.id);

  const newStartup = {
    name: "test",
    description: "test startup",
  };

  const startup = await createTestStartup(
    newStartup.name,
    newStartup.description,
  );

  await db.query(
    "INSERT INTO startup_users (startup_id, user_id, role) VALUES($1,$2,$3)",
    [startup.id, user.id, "owner"],
  );

  return { startup: startup, user: user, token: token };
}

module.exports = {
  createOwnedStartup,
};
