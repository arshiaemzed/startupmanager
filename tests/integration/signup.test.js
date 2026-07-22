const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const cleanDatabase = require("../helpers/cleanDatabase");

describe("POST /auth/register", () => {
  test("should register a new user", async () => {
    const newUser = {
      email: "emzedali@gmail.com",
      password: "emzed1234",
      name: "EmZeD Ali",
      userName: "emzedali",
    };

    const response = await request(app).post("/auth/signup").send(newUser);

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
    expect(response.body).toHaveProperty("userName");

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      newUser.email,
    ]);

    expect(result.rows).toHaveLength(1);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
