const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createTestStartup } = require("../helpers/startup");

async function createJoinedStartup() {
  const newUser = {
    email: "somehero@gmail.com",
    password: "somehero1234",
    name: "Somehero",
    userName: "somehero1234",
  };

  const user = await createTestUser(newUser);

  const token = await createAccessToken(user.id);

  const newStartup = {
    name: "test",
    description: "test startup",
    owner: user.id,
  };

  const startup = await createTestStartup(
    newStartup.name,
    newStartup.description,
    newStartup.owner,
  );

  const response = await request(app)
    .post(`/startup/join/${startup.id}`)
    .set("Authorization", `Bearer ${token}`);
  return { startup: startup, user: user, token: token, response: response };
}

module.exports = {
  createJoinedStartup,
};
