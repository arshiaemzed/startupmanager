const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const {
  getTestAccessToken,
  createAccessToken,
  createTestUser,
} = require("../helpers/auth");
const cleanDatabase = require("../helpers/cleanDatabase");

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

  beforeEach(async () => {
    await cleanDatabase();
  });
});
