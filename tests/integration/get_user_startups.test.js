const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const uuid = require("uuid");
const expectError = require("../helpers/expectError");
const expectAuth = require("../helpers/expectAuth");

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

  expectAuth("get", `/startups`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
