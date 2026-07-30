const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const insertUserIntoStartup = require("../helpers/insertUserIntoStartup");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");
const expectAuth = require("../helpers/expectAuth");

describe("PATCH /startup/:id/members/:memberid/role", () => {
  test("Should be able to update member role", async () => {
    const startup = await createOwnedStartup();
    const user = await createTestUser({
      email: "testemail@gmail.com",
      userName: "testemailali",
    });
    const token = await createAccessToken(user.id);

    await insertUserIntoStartup(startup.startup.id, user.id, "worker");

    const response = await request(app)
      .patch(`/startup/${startup.startup.id}/members/${user.id}/role`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ role: "admin" });

    const body = response.body[0];

    expect(response.status).toBe(200);

    expect(body).toHaveProperty("user_id");
    expect(body).toHaveProperty("startup_id");
    expect(body).toHaveProperty("role");

    expect(typeof body.user_id).toBe("string");
    expect(typeof body.startup_id).toBe("string");
    expect(typeof body.role).toBe("string");

    expect(body.user_id).toBe(user.id);
    expect(body.startup_id).toBe(startup.startup.id);
    expect(body.role).toBe("admin");
  });

  test("Should not be able to update user role if the user sending the request is not joined in the startup", async () => {
    const startup = await createOwnedStartup();

    const user = await createTestUser({
      email: "helloworld@gmail.com",
      userName: "helloworld",
    });

    const response = await request(app)
      .patch(`/startup/${startup.startup.id}/members/${user.id}/role`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ role: "admin" });

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
    });
  });

  expectAuth("patch", `/startup/${uuid.v4()}/members/${uuid.v4()}/role`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
