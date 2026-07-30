const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");

describe("GET /startup/:id/members", () => {
  test("Should get all members within a startup", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("startup_id");
    expect(response.body[0]).toHaveProperty("user_id");
    expect(response.body[0]).toHaveProperty("role");
    expect(response.body[0]).toHaveProperty("joined_on");

    expect(typeof response.body[0].id).toBe("string");
    expect(typeof response.body[0].startup_id).toBe("string");
    expect(typeof response.body[0].user_id).toBe("string");
    expect(typeof response.body[0].joined_on).toBe("string");
    expect(typeof response.body[0].role).toBe("string");
  });
  test("Should not be able to get all members within a startup if not joined in the startup ", async () => {
    const startup = await createStartupWithoutMember();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/${startup.startupData.id}/members`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
    });
  });

  test("Should not be able to get all members if the startup doesnt exists", async () => {
    const id = uuid.v4();
    const startup = await createOwnedStartup();

    const response = await request(app)
      .get(`/startup/${id}/members`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
    });
  });

  test("Should not be able to get all members if the id param is invalid ", async () => {
    const id = await uuid.v4();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/invalid/members`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
    });
  });

  test("Should not allow user to get all members within a startup if provided with no authorization", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app).get(
      `/startup/${startup.startup.id}/members`,
    );

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
    });
  });

  test("Should not allow a user to get all members withtin a startup if provided with invalid/expired token", async () => {
    const id = uuid.v4();

    const startup = await createOwnedStartup();

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members`)
      .set("Authorization", `Bearer ${id}`);

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_ACCESS_TOKEN",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
