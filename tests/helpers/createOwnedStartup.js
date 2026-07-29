const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createTestStartup } = require("../helpers/startup");
const insertUserIntoStartup = require("../helpers/insertUserIntoStartup");

async function createOwnedStartup(overrideUser = {}) {
  const newUser = {
    email: "test@gmail.com",
    password: "test1234",
    name: "Test user",
    userName: "test_user",
    ...overrideUser,
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

  await insertUserIntoStartup(startup.id, user.id, "owner");

  return { startup: startup, user: user, token: token };
}

module.exports = createOwnedStartup;
