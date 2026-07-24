const supertest = require("supertest");

function expectError(response, expected) {
  expect(response.status).toBe(expected.status);

  expect(response.body).toHaveProperty("success");
  expect(response.body).toHaveProperty("error");
  expect(response.body.error).toHaveProperty("message");
  expect(response.body.error).toHaveProperty("code");

  expect(typeof response.body.success).toBe("boolean");
  expect(typeof response.body.error).toBe("object");
  expect(typeof response.body.error.message).toBe("string");
  expect(typeof response.body.error.code).toBe("string");

  expect(response.body.success).toBe(false);
  expect(response.body.error.code).toBe(expected.code);
  expect(response.body.error.message).toBe(expected.message);
}

module.exports = expectError;
