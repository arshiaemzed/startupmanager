const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const createOwnedStartup = require("../helpers/createOwnedStartup");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
describe("POST /startup/:id/tasks", () => {
  test("Should create new task", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app)
      .post(`/startup/${startup.startup.id}/tasks`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({
        title: "Test task",
        description: "this is a test task",
        status: "todo",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("startup_id");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("assigned_to");
    expect(response.body).toHaveProperty("created_at");

    expect(response.body.name).toBe("Test task");
    expect(response.body.description).toBe("this is a test task");
    expect(response.body.startup_id).toBe(startup.startup.id);
    expect(response.body.status).toBe("todo");
    expect(response.body.assigned_to).toBe(null);

    const query = await db.query("SELECT * FROM tasks");

    expect(query.rows).toHaveLength(1);
  });

  test("Should fail to create a task if startup doesnt exists", async () => {
    const id = uuid.v4();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post(`/startup/${id}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task", description: "this is a test task" });

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
    });
  });

  test("Should fail to create a task if provided with invalid value for id param", async () => {
    const startup = await createOwnedStartup();

    const response = await request(app)
      .post(`/startup/invalid/tasks`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ title: "Test task", description: "this is a test task" });

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
    });
  });

  test("Should fail to create a task if not joined in the startup", async () => {
    const startup = await createStartupWithoutMember();
    const user = await createTestUser();
    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post(`/startup/${startup.startupData.id}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test task", description: "this is a test task" });

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
    });
  });

  test("Should fail to create a task if the user role is not owner nor admin", async () => {
    const startup = await createJoinedStartup();

    const response = await request(app)
      .post(`/startup/${startup.startup.id}/tasks`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ title: "Test task", description: "this is a test task" });

    expectError(response, {
      status: 403,
      code: "NO_PERMISSION",
    });
  });

  const validTask = {
    title: "Test task",
    description: "This is a test task",
  };

  test.each([
    { case: "title is empty string", overrides: { title: "" } },
    { case: "title is wrong type", overrides: { title: 21331231 } },
    { case: "title is invalid", overrides: { title: undefined } },
  ])("Should fail to create a new task if $case", async ({ overrides }) => {
    const startup = await createOwnedStartup();
    const response = await request(app)
      .post(`/startup/${startup.startup.id}/tasks`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ ...validTask, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
    });
  });

  test.each([
    { case: "description is empty string", overrides: { description: "" } },
    { case: "description is wrong type", overrides: { description: 21331231 } },
    { case: "description is invalid", overrides: { description: undefined } },
  ])("Should fail to create a new task if $case", async ({ overrides }) => {
    const startup = await createOwnedStartup();
    const response = await request(app)
      .post(`/startup/${startup.startup.id}/tasks`)
      .set("Authorization", `Bearer ${startup.token}`)
      .send({ ...validTask, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
    });
  });

  test("Should disallow a user to use create task endpoint if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .post(`/startup/${id}/tasks`)
      .send({ title: "Test task", description: "this is a test task" });

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
    });
  });

  test("Should disallow a user to use create task endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();

    const response = await request(app)
      .post(`/startup/${id}/tasks`)
      .send({ title: "Test task", description: "this is a test task" })
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
