const db = require("../../database/db");
const app = require("../../app");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const uuid = require("uuid");
const expectError = require("../helpers/expectError");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const expectAuth = require("../helpers/expectAuth");

describe("POST /startup/leave/:id", () => {
  test("Should not allow a user to leave startup if joined", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.status).toBe(200);

    const response = await request(app)
      .post(`/startup/leave/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("message");

    expect(typeof response.body.message).toBe("string");

    expect(response.body.message).toBe("leaved the startup successfully");

    const result = await db.query(
      "SELECT * FROM startup_users WHERE startup_id = $1 AND user_id = $2",
      [startup.startup.id, startup.user.id],
    );

    expect(result.rows).toHaveLength(0);
  });

  test("Should not allow a user trying to leave a startup that they are not joined in", async () => {
    const startup = await createStartupWithoutMember();

    const response = await request(app)
      .post(`/startup/leave/${startup.startupData.id}`)
      .set("Authorization", `Bearer ${startup.userToken}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should not allow a user trying to leave a startup that has invalid id param input", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post("/startup/leave/randomali")
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("Should not allow a user trying to leave a startup that doesnt exist", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const id = uuid.v4();

    const response = await request(app)
      .post(`/startup/leave/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should not allow a user to use leave endpoint if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app).post(`/startup/leave/${id}`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should not allow a user to use leave endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .post(`/startup/leave/${id}`)
      .set("Authorization", `Bearer ${id}`);

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_ACCESS_TOKEN",
      message: "Invalid or expired access token",
    });
  });

  test("Should delete the startup if owner leaves", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app)
      .post(`/startup/leave/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("message");

    expect(response.body.message).toBe("successfully deleted startup");

    expect(typeof response.body.message).toBe("string");

    const startups = await db.query("SELECT * FROM startups");

    const startupUsers = await db.query("SELECT * FROM startup_users");

    const startupTasks = await db.query("SELECT * FROM tasks");

    expect(startups.rows).toHaveLength(0);
    expect(startupUsers.rows).toHaveLength(0);
    expect(startupTasks.rows).toHaveLength(0);
  });

  expectAuth("post", `/startup/leave/${uuid.v4()}`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
