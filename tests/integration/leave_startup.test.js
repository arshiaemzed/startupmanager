const db = require("../../database/db");
const app = require("../../app");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createTestStartup } = require("../helpers/startup");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");

describe("POST /startup/leave/:id", () => {
  test("Should allow a user to leave startup if joined", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.status).toBe(200);

    const response = await request(app)
      .post(`/startup/leave/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("message");

    expect(typeof response.body["message"]).toBe("string");

    expect(response.body["message"]).toBe("leaved the startup successfully");

    const result = await db.query(
      "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
      [startup.id, startup.user.id],
    );

    expect(result.rows).toHaveLength(0);
  });

  test("Should disallow a user trying to leave a startup that they are not joined in", async () => {
    const startup = await createStartupWithoutMember();

    const response = await request(app)
      .post(`/startup/leave/${startup.startupData.id}`)
      .set("Authorization", `Bearer ${startup.userToken}`);

    expect(response.status).toBe(403);

    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("error");
    expect(response.body["error"]).toHaveProperty("message");
    expect(response.body["error"]).toHaveProperty("code");
    expect(response.body["error"]["code"]).toBe("NOT_JOINED_IN_STARTUP");
    expect(response.body["error"]["message"]).toBe(
      "You are not joined in the startup",
    );
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
