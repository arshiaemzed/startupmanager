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

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("owner");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");

    expect(response.status).toBe(201);
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

  beforeEach(async () => {
    await cleanDatabase();
  });
});
