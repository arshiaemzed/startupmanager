const app = require("../../app");
const db = require("../../database/db");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createTestUser, createRefreshToken } = require("../helpers/auth");
const expectError = require("../helpers/expectError");
const expectAuth = require("../helpers/expectAuth");

describe("POST /auth/logout", () => {
  test("should allow user to logout if provided with valid refresh token", async () => {
    const user = await createTestUser();

    const refreshToken = await createRefreshToken(user);

    const response = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "Successfully logged out and killed the refresh token",
    );
  });

  test("should not allow user to logout if provided with refresh token that doesnt exist in database", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set(
        "Authorization",
        `Bearer 312eio12eio12ok12kwe12koek1o2oekoko12eko12eoe12`,
      );

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_REFRESH_TOKEN",
      message: "Refresh token is not valid",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
