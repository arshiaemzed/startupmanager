const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const { user } = require("pg/lib/defaults");

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

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      newUser.email,
    ]);

    expect(result.rows).toHaveLength(1);
  });
});

beforeEach(async () => {
  await db.query("TRUNCATE TABLE users CASCADE");
});

afterAll(async () => {
  await db.end();
});
