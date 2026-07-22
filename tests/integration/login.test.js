const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { createTestUser } = require("../helpers/auth");
const cleanDatabase = require("../helpers/cleanDatabase");

describe("POST /auth/login", () => {
  test("should login and return accesstoken + refresh token", async () => {
    const user = await createTestUser({
      email: "nein@gmail.com",
      password: "nein1234",
      name: "Nein",
      userName: "nein_32",
    });

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(response.body).toHaveProperty("access_token");
    expect(response.body).toHaveProperty("refresh_token");

    expect(typeof response.body["access_token"]).toBe("string");
    expect(typeof response.body["refresh_token"]).toBe("string");
  });

  test("should return an error object if given invalid credentials.", async () => {
    const invalidUser = {
      email: "invalid@gmail.com",
      password: "invalid1234",
    };

    const response = await request(app).post("/auth/login").send(invalidUser);

    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("success");

    expect(response.body).toHaveProperty("error");

    expect(response.body["error"]).toHaveProperty("message");

    expect(response.body["error"]).toHaveProperty("code");

    expect(response.body["success"]).toBe(false);

    expect(response.body["error"]["code"]).toBe("INVALID_CREDENTIALS");
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
