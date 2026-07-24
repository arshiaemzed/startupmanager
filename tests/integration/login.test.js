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

  test("should disallow user to login if given invalid email.", async () => {
    const user = await createTestUser({
      email: "test@gmail.com",
      password: "test1234",
      name: "Test",
      userName: "test_12",
    });

    const invalidUser = {
      email: "invalid@gmail.com",
      password: "test1234",
    };

    const response = await request(app).post("/auth/login").send(invalidUser);

    expectError(response, {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials.",
    });
  });

  test("should disallow user to login if given invalid password.", async () => {
    const user = await createTestUser({
      email: "test@gmail.com",
      password: "test1234",
      name: "Test",
      userName: "test_12",
    });

    const invalidUser = {
      email: "test@gmail.com",
      password: "nopassword1234",
    };

    const response = await request(app).post("/auth/login").send(invalidUser);

    expectError(response, {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials.",
    });
  });

  test("Should disallow user to login if given empty string for email ", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "", password: "test1234" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if not  given email ", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ password: "test1234" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if given invalid type for email.", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: 123213123, password: "test1234" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if given empty string for password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: "" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if not given password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com" });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Invalid credentials",
    });
  });

  test("Should disallow user to login if given wrong type for password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@gmail.com", password: 2134132 });

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
