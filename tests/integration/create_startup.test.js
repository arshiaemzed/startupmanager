const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const {
  getTestAccessToken,
  createAccessToken,
  createTestUser,
} = require("../helpers/auth");
const cleanDatabase = require("../helpers/cleanDatabase");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");

describe("POST /startup", () => {
  test("should return an object when creating startup", async () => {
    const user = await createTestUser({
      email: "hoho@gmail.com",
      password: "hoho1234",
      name: "Hoho",
      userName: "hoho_12",
    });

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post("/startup")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "test startup", description: "test description startup" });

    const query = await db.query("SELECT * FROM startups");

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("owner");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");

    expect(query.rows).toHaveLength(1);
  });

  const validStartup = {
    name: "Test startup",
    description: "this is my test startup",
  };

  test.each([
    {
      case: "name is empty string",
      overrides: { name: "" },
    },
    {
      case: "name is wrong type",
      overrides: { name: 132213123 },
    },
    {
      case: "name is invalid",
      overrides: { name: undefined },
    },
  ])("disallows creating startup when $case", async ({ overrides }) => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post("/startup")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validStartup, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid name field(Bad Request)",
    });
  });

  test.each([
    {
      case: "description is empty string",
      overrides: { description: "" },
    },
    {
      case: "description is wrong type",
      overrides: { description: 121313213 },
    },
    {
      case: "description is invalid",
      overrides: { description: undefined },
    },
  ])("disallow creating startup when $case", async ({ overrides }) => {
    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .post("/startup")
      .set("Authorization", `Bearer ${token}`)
      .send({ ...validStartup, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid description field(Bad Request)",
    });
  });

  test("Should not allow a user to use join endpoint if provided with no authorization", async () => {
    const id = uuid.v4();
    const response = await request(app).post(`/startup`);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should not allow a user to use join endpoint if provided with invalid/expired token", async () => {
    const id = uuid.v4();
    const response = await request(app)
      .post(`/startup`)
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
