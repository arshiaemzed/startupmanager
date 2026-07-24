const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const bcrypt = require("bcrypt");
const { createTestUser } = require("../helpers/auth");
const cleanDatabase = require("../helpers/cleanDatabase");
const expectError = require("../helpers/expectError");

describe("POST /auth/login", () => {
  test("should allow user login if given valid credentials.", async () => {
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

  test("should disallow user to login if given invalid credentials.", async () => {
    const invalidUser = {
      email: "invalid@gmail.com",
      password: "invalid1234",
    };

    const response = await request(app).post("/auth/login").send(invalidUser);

    expectError(response, {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials.",
    });
  });

  test("Should disallow user to login if given invalid fields for email or password(no email or password field)", async () => {
    const response = await request(app).post("/auth/login").send({});

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if given invalid fields for email or password(integer email)", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: 123213123, password: "11eweowe" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if given invalid fields for email or password(empty string for email and password)", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "", password: "" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
