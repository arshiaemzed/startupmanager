const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const uuid = require("uuid");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const expectAuth = require("../helpers/expectAuth");

describe("GET /startup/:id/tasks", () => {
  test("Should return all startup tasks", async () => {
    const startup = await createOwnedStartup();

    await db.query(
      "INSERT INTO tasks (name, description, startup_id, assigned_to, status) VALUES ($1, $2, $3, $4, $5)",
      [
        "My task",
        "this is my task",
        startup.startup.id,
        startup.user.id,
        "todo",
      ],
    );

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/tasks`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("startup_id");
    expect(response.body[0]).toHaveProperty("assigned_to");
    expect(response.body[0]).toHaveProperty("status");
    expect(response.body[0]).toHaveProperty("created_at");
    expect(response.body[0]).toHaveProperty("updated_at");
    expect(response.body[0]).toHaveProperty("task_order");
  });

  test("Should fail to get all task if startup doesnt exists", async () => {
    const id = uuid.v4();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/${id}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
    });
  });

  test("Should fail to get all tasks within a startup if provided with invalid value for id param", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app)
      .get(`/startup/invalid/tasks`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
    });
  });

  test("Should fail to get all tasks within startup if not joined in the startup", async () => {
    const startup = await createStartupWithoutMember();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/${startup.startupData.id}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
    });
  });

  expectAuth("get", `/startup/${uuid.v4()}/tasks`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
