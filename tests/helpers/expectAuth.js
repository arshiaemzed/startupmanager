const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const expectError = require("./expectError");

async function expectAuth(httpMethod, URL) {
  test(`/${httpMethod} ${URL} should fail if provided with no authorization header`, async () => {
    const response = await request(app)[httpMethod](URL);

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test(`/${httpMethod} ${URL} should fail if provided with invalid/expired token`, async () => {
    const response = await request(app)
      [httpMethod](URL)
      .set("Authorization", `Bearer fake-token-btw`);

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_ACCESS_TOKEN",
      message: "Invalid or expired access token",
    });
  });
}

module.exports = expectAuth;
