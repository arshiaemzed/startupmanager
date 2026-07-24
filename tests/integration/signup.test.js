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

  test("should disallow user to register if given invalid fields.", async () => {
    const response = await request(app).post("/auth/signup").send();

    expectError(response, {
      status: 400,
      code: "INVALID_REQUEST_BODY",
      message: "Invalid request body.",
    });
  });

  test("should disallow user to register if given wrong type for email field", async () => {
    const user = {
      name: "arshia pashmak",
      userName: "pashmak",
      email: 1231313,
      password: "1234123",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid email",
    });
  });

  test("should disallow user to register if given empty string for email field", async () => {
    const user = {
      name: "arshia pashmak",
      userName: "pashmak",
      email: "",
      password: "1234123",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid email",
    });
  });

  test("should disallow user to register if no field for email field", async () => {
    const user = {
      name: "arshia pashmak",
      userName: "pashmak",
      password: "1234123",
    };

    const response = await request(app).post("/auth/signup").send(user);

    expectError(response, {
      status: 400,
      code: "INVALID_FIELD",
      message: "Please enter a valid email",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
