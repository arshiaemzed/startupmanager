const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const createMockTaskForStartup = require("../helpers/createTaskForStartup");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");
const expectAuth = require("../helpers/expectAuth");

describe("PATCH /startup/:startupid/tasks/:id", () => {
  test("Should update task", async () => {
    const data = await createOwnedStartup();
    const task = await createMockTaskForStartup(data.startup.id);

    const response = await request(app)
      .patch(`/startup/${data.startup.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${data.token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: data.user.id,
      });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("assigned_to");

    expect(response.body).toHaveProperty("created_at");
    expect(response.body).toHaveProperty("updated_at");
    expect(response.body).toHaveProperty("task_order");

    expect(typeof response.body.id).toBe("string");
    expect(typeof response.body.name).toBe("string");
    expect(typeof response.body.description).toBe("string");
    expect(typeof response.body.status).toBe("string");

    expect(typeof response.body.created_at).toBe("string");
    expect(typeof response.body.updated_at).toBe("string");
    expect(typeof response.body.task_order).toBe("number");

    expect(response.body.name).toBe("Updated task");
    expect(response.body.description).toBe("updated task description");
    expect(response.body.status).toBe("in_progress");
  });

  test("Should not be able to update task if not joined in the startup", async () => {
    const data = await createStartupWithoutMember();

    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const task = await createMockTaskForStartup(data.startupData.id);

    const response = await request(app)
      .patch(`/startup/${data.startupData.id}/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: user.id,
      });

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should not be able to update the task if startup doesnt exists", async () => {
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const id = uuid.v4();

    const response = await request(app)
      .patch(`/startup/${id}/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: user.id,
      });

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should fail to update task if provided with invalid value for startupid param", async () => {
    const startup = await createOwnedStartup();
    const task = await createMockTaskForStartup(startup.startup.id);

    const response = await request(app)
      .patch(`/startup/invalid/tasks/${task.id}`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: startup.user.id,
      });

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "Invalid input for startupid param.",
    });
  });

  test("Should fail to update task if task doesnt exists", async () => {
    const id = uuid.v4();
    const startup = await createOwnedStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .patch(`/startup/${startup.startup.id}/tasks/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: startup.user.id,
      });

    expectError(response, {
      status: 404,
      code: "TASK_NOT_FOUND",
      message: "Unable to find the task.",
    });
  });

  test("Should fail to update task if provided with invalid value for id param", async () => {
    const startup = await createOwnedStartup();
    const token = await createAccessToken(startup.user.id);

    const response = await request(app)
      .patch(`/startup/${startup.startup.id}/tasks/invalid`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated task",
        description: "updated task description",
        status: "in_progress",
        assigned_to: startup.user.id,
      });

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "invalid input for id param.",
    });
  });

  const validTask = {
    title: "Valid task",
    description: "Valid task description",
    status: "todo",
    assigned_to: null,
  };

  test.each([
    { case: "title is empty string", overrides: { title: "" } },
    { case: "title is wrong type", overrides: { title: 12313 } },
    { case: "title is invalid", overrides: { title: undefined } },
  ])(
    "Should not allow a user to update a task if $case ",
    async ({ overrides }) => {
      const data = await createOwnedStartup();
      const task = await createMockTaskForStartup(data.startup.id);

      const response = await request(app)
        .patch(`/startup/${data.startup.id}/tasks/${task.id}`)
        .set("Authorization", `Bearer ${data.token}`)
        .send({
          ...validTask,
          ...overrides,
        });

      expectError(response, {
        status: 400,
        code: "INVALID_FIELD",
        message: "Invalid title.",
      });
    },
  );

  test.each([
    { case: "description is empty string", overrides: { description: "" } },
    { case: "description is wrong type", overrides: { description: 12313 } },
    { case: "description is invalid", overrides: { description: undefined } },
  ])(
    "Should not allow a user to update a task if $case ",
    async ({ overrides }) => {
      const data = await createOwnedStartup();
      const task = await createMockTaskForStartup(data.startup.id);

      const response = await request(app)
        .patch(`/startup/${data.startup.id}/tasks/${task.id}`)
        .set("Authorization", `Bearer ${data.token}`)
        .send({
          ...validTask,
          ...overrides,
        });

      expectError(response, {
        status: 400,
        code: "INVALID_FIELD",
        message: "Invalid description.",
      });
    },
  );

  test.each([
    { case: "status is empty string", overrides: { status: "" } },
    { case: "status is wrong type", overrides: { status: 12313 } },
    { case: "status is invalid", overrides: { status: undefined } },
  ])(
    "Should not allow a user to update a task if $case ",
    async ({ overrides }) => {
      const data = await createOwnedStartup();
      const task = await createMockTaskForStartup(data.startup.id);

      const response = await request(app)
        .patch(`/startup/${data.startup.id}/tasks/${task.id}`)
        .set("Authorization", `Bearer ${data.token}`)
        .send({
          ...validTask,
          ...overrides,
        });

      expectError(response, {
        status: 400,
        code: "INVALID_FIELD",
        message: "Invalid status.",
      });
    },
  );

  expectAuth("patch", `/startup/${uuid.v4()}/tasks/${uuid.v4()}`);

  beforeEach(async () => {
    await cleanDatabase();
  });
});
