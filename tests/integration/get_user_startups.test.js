const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const uuid = require("uuid");
const expectError = require("../helpers/expectError");

describe("GET /startups", () => {
  test("should get user startups", async () => {
    const userStartup = await createJoinedStartup();

    const response = await request(app)
      .get("/startups")
      .set("Authorization", `Bearer ${userStartup.token}`);

    const startupData = response.body[0];
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(startupData).toHaveProperty("id");
    expect(startupData).toHaveProperty("name");
    expect(startupData).toHaveProperty("description");
    expect(startupData).toHaveProperty("created_at");
    expect(startupData).toHaveProperty("startup_id");
    expect(startupData).toHaveProperty("user_id");
    expect(startupData).toHaveProperty("role");
  });

  test("Should not allow a user to use get endpoint if provided with no authorization", async () => {
    const response = await request(app).get(`/startups`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should not allow a user to use get endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .get(`/startups`)
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
