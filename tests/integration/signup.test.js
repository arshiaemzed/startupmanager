const request = require("supertest");
const app = require("../../app");
const db = require("../../database/db");
const cleanDatabase = require("../helpers/cleanDatabase");
const expectError = require("../helpers/expectError");

describe("POST /auth/signup", () => {
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

  const validUser = {
    email: "test@gmail.com",
    password: "test123456",
    name: "Test account",
    userName: "test_1234",
  };

  test.each([
    { case: "email is empty string", overrides: { email: "" } },
    { case: "email is wrong type", overrides: { email: 12313123 } },
    { case: "email is invalid", overrides: { email: undefined } },
  ])("user should not be able to register if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...validUser, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid email",
    });
  });

  test.each([
    { case: "password is empty string", overrides: { password: "" } },
    { case: "password is wrong type", overrides: { password: 12313123 } },
    { case: "password is invalid", overrides: { password: undefined } },
  ])("user should not be able to register if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...validUser, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid password",
    });
  });

  test.each([
    { case: "name is empty string", overrides: { name: "" } },
    { case: "name is wrong type", overrides: { name: 12313123 } },
    { case: "name is invalid", overrides: { name: undefined } },
  ])("user should not be able to register if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...validUser, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter valid name",
    });
  });

  test.each([
    { case: "userName is empty string", overrides: { userName: "" } },
    { case: "userName is wrong type", overrides: { userName: 12313123 } },
    { case: "userName is invalid", overrides: { userName: undefined } },
  ])("user should not be able to register if $case", async ({ overrides }) => {
    const response = await request(app)
      .post("/auth/signup")
      .send({ ...validUser, ...overrides });

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid and unique username",
    });
  });

  test("user should not be able to register if the length of their password is less than 6", async () => {
    const user = {
      name: "Test ali",
      userName: "test1224",
      email: "test@gmail.com",
      password: "1234",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      code: "INVALID_PASSWORD_LENGTH",
      message: "Password length must be more than 6",
    });
  });

  test("user should not be able to register if the length of their name is less than 6", async () => {
    const user = {
      name: "test",
      userName: "test1224",
      email: "test@gmail.com",
      password: "418231!#@#password",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      code: "INVALID_NAME_LENGTH",
      message: "Name length must be more than 6",
    });
  });

  test("user should not be able to register if the userName length is less than 6", async () => {
    const user = {
      name: "Test Ali",
      userName: "test",
      email: "test@gmail.com",
      password: "418231!#@#password",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      message: "Username length must be more than 6",
      code: "INVALID_USERNAME_LENGTH",
    });
  });

  test("user should not be able to register if the userName doesnt validate", async () => {
    const user = {
      name: "Test Ali",
      userName: "test#$@##w",
      email: "test@gmail.com",
      password: "418231!#@#password",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      message: "username can only contains numbers and characters",
      code: "INVALID_USERNAME",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
