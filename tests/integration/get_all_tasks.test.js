const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const createTestStartup = require("../helpers/createTestStartup");
const uuid = require("uuid");
const cleanDatabase = require("../helpers/cleanDatabase");

describe("GET /startup/:id/tasks", () => {
  test("Should return all startup tasks", async () => {
    const startup = await createTestStartup();

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

  beforeEach(async () => {
    await cleanDatabase();
  });
});
