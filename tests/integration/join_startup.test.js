const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");
const expectAuth = require("../helpers/expectAuth");

describe("POST /startup/join/:id", () => {
  test("should join startup", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.body).toHaveProperty("message");

    expect(typeof startup.response.body["message"]).toBe("string");

    expect(startup.response.body["message"]).toBe(
      "joined startup successfully",
    );

    expect(startup.response.status).toBe(200);
  });

  test("should not allow the user to join startup that they are already joined in.", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.status).toBe(200);

    expect(startup.response.body).toHaveProperty("message");

    expect(typeof startup.response.body["message"]).toBe("string");

    expect(startup.response.body["message"]).toBe(
      "joined startup successfully",
    );

    const response = await request(app)
      .post(`/startup/join/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 403,
      code: "ALREADY_JOINED_STARTUP",
      message: "You already joined the startup",
    });
  });

  test("should disallow user trying to join a startup with invalid param input.", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post("/startup/join/invalidparam")
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("should disallow user trying to join a startup that doesnt exist.", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const id = uuid.v4();

    const response = await request(app)
      .post(`/startup/join/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should disallow a user to use join endpoint if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app).post(`/startup/join/${id}`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should disallow a user to use join endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .post(`/startup/join/${id}`)
      .set("Authorization", `Bearer ${id}`);

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_ACCESS_TOKEN",
      message: "Invalid or expired access token",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
