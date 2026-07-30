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
    });
  });

  const validLoginInfo = {
    email: "test@gmail.com",
    password: "test1234",
  };

  test.each([
    { case: "email is empty string", overrides: { email: "" } },
    { case: "email is wrong type", overrides: { email: 12313123 } },
    { case: "email is invalid", overrides: { email: undefined } },
  ])("shouldnt allow user to login if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...validLoginInfo, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
    });
  });

  test.each([
    { case: "password is empty string", overrides: { password: "" } },
    { case: "password is wrong type", overrides: { password: 12313123 } },
    { case: "password is invalid", overrides: { password: undefined } },
  ])("shouldnt allow user to login if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/login")
      .send({ ...validLoginInfo, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
