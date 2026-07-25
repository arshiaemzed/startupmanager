const db = require("../../database/db");
const app = require("../../app");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const createTestStartup = require("../helpers/createTestStartup");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");

describe("DELETE /startup/:id", () => {
  test("should be able to delete startup", async () => {
    const startup = await createTestStartup();

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body["message"]).toBe("successfully deleted startup");
  });

  test("should not be able to delete startup because of permission", async () => {
    const startup = await createJoinedStartup();

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 403,
      code: "NO_PERMISSION",
      message: "Only owner's can delete startups.",
    });
  });

  test("Should not allow a user trying to delete a startup that has invalid id param input", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .delete("/startup/randomali")
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("Should not allow a user trying to delete a startup that doesnt exist", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const id = uuid.v4();

    const response = await request(app)
      .delete(`/startup/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("should not be able to delete startup if not joined", async () => {
    const startup = await createStartupWithoutMember();

    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .delete(`/startup/${startup.startupData.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should disallow a user to use delete endpoint if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app).delete(`/startup/${id}`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should disallow a user to use delete endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .delete(`/startup/${id}`)
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
