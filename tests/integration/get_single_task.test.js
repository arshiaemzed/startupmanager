const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const createTestStartup = require("../helpers/createTestStartup");
const uuid = require("uuid");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const createMockTaskForStartup = require("../helpers/createTaskForStartup");
const expectAuth = require("../helpers/expectAuth");

describe("GET /startup/:startupid/tasks/:id", () => {
  test("Should get a task", async () => {
    const startup = await createTestStartup();

    const task = await createMockTaskForStartup(startup.startup.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/tasks/${task.id}`)
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

  test("Should fail to get task if startup doesnt exists", async () => {
    const id = uuid.v4();

    const startup = await createTestStartup();
    const task = await createMockTaskForStartup(startup.startup.id);
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .get(`/startup/${id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should fail to get a task if provided with invalid value for startupid param", async () => {
    const startup = await createTestStartup();
    const task = await createMockTaskForStartup(startup.startup.id);
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .get(`/startup/invalid/tasks/${task.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for startupid param.",
    });
  });

  test("Should fail to get task if task doesnt exists", async () => {
    const id = uuid.v4();
    const startup = await createTestStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "TASK_NOT_FOUND",
      message: "Unable to find the task.",
    });
  });

  test("Should fail to get task if provided with invalid value for id param", async () => {
    const startup = await createTestStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/tasks/invalid`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("Should fail to get a task if not joined in the startup", async () => {
    const startup = await createStartupWithoutMember();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);
    const task = await createMockTaskForStartup(startup.startupData.id);

    const response = await request(app)
      .get(`/startup/${startup.startupData.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  expectAuth("get", `/startup/${uuid.v4()}/tasks/${uuid.v4()}`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
