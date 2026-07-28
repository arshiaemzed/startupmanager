const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const uuid = require("uuid");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const createMockTaskForStartup = require("../helpers/createTaskForStartup");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");

describe("DELETE /startup/:startupid/tasks/:id", () => {
  test("Should delete a task", async () => {
    const startup = await createOwnedStartup();

    const task = await createMockTaskForStartup(startup.startup.id);

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(204);

    const result = await db.query("SELECT * FROM tasks WHERE startup_id = $1", [
      startup.startup.id,
    ]);

    expect(result.rows).toHaveLength(0);
  });

  test("Should fail to get task if startup doesnt exists", async () => {
    const id = uuid.v4();

    const startup = await createOwnedStartup();
    const task = await createMockTaskForStartup(startup.startup.id);
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .delete(`/startup/${id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should fail to get a task if provided with invalid value for startupid param", async () => {
    const startup = await createOwnedStartup();
    const task = await createMockTaskForStartup(startup.startup.id);
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .delete(`/startup/invalid/tasks/${task.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for startupid param.",
    });
  });

  test("Should fail to delete task within startup if not joined in the startup", async () => {
    const startup = await createStartupWithoutMember();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);
    const task = await createMockTaskForStartup(startup.startupData.id);

    const response = await request(app)
      .delete(`/startup/${startup.startupData.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should fail to delete task within startup if lacks permission", async () => {
    const startup = await createJoinedStartup();

    const task = await createMockTaskForStartup(startup.startup.id);
    const response = await request(app)
      .delete(`/startup/${startup.startup.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 403,
      code: "NO_PERMISSION",
      message: "Only owner and admin can delete tasks",
    });
  });

  test("Should fail to delete task if task doesnt exists", async () => {
    const id = uuid.v4();
    const startup = await createOwnedStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 404,
      code: "TASK_DOESNT_EXIST",
      message: "Task does not exists",
    });
  });

  test("Should fail to delete task if provided with invalid value for id param", async () => {
    const startup = await createOwnedStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}/tasks/invalid`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  test("Should not allow a user to use delete a task within a startup if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app).delete(`/startup/${id}/tasks/${id}`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should not allow a user to delete a task withtin a startup if provided with invalid/expired token", async () => {
    const id = uuid.v4();

    const response = await request(app)
      .delete(`/startup/${id}/tasks/${id}`)
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
