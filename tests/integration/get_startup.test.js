const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");
const createTestStartup = require("../helpers/createTestStartup");
const expectAuth = require("../helpers/expectAuth");

describe("GET /startup/:id", () => {
  test("Should allow user to get startup data if joined", async () => {
    const startup = await createJoinedStartup();

    const response = await request(app)
      .get(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("startup_id");
    expect(response.body).toHaveProperty("tasks");
    expect(response.body).toHaveProperty("members");
  });

  test("Should not allow user to get startup data if not joined", async () => {
    const user = await createTestUser();
    const token = await createAccessToken(user.id);
    const startup = await createStartupWithoutMember();

    const response = await request(app)
      .get(`/startup/${startup.startupData.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should not allow a user trying to get startup data that has invalid id param input", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get("/startup/randomali")
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("Should not allow a user trying to get startup data that doesnt exist", async () => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const id = uuid.v4();

    const response = await request(app)
      .get(`/startup/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  expectAuth("get", `/startup/${uuid.v4()}`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
