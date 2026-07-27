const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const createTestStartup = require("../helpers/createTestStartup");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const insertUserIntoStartup = require("../helpers/insertUserIntoStartup");
const expectError = require("../helpers/expectError");
const uuid = require("uuid");

describe("GET /startup/:id/members/:memberid", () => {
  test("Should be able to get a specific member info", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "test2account@gmail.com",
      password: "test22312",
      name: "Test awe",
      userName: "test_sami",
    });

    insertUserIntoStartup(startup.startup.id, user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members/${user.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("startup_id");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("joined_on");

    expect(typeof response.body.id).toBe("string");
    expect(typeof response.body.startup_id).toBe("string");
    expect(typeof response.body.user_id).toBe("string");
    expect(typeof response.body.role).toBe("string");
    expect(typeof response.body.joined_on).toBe("string");
  });

  test("Should not be able to get a specific member info if not joined in the startup", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "helloasb@gmail.com",
      password: "asb1234",
      name: "Asbam",
      userName: "asb_1234",
    });

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members/${startup.user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expectError(response, {
      status: 403,
      code: "NOT_JOINED_IN_STARTUP",
      message: "You are not joined in the startup",
    });
  });

  test("Should not be able to get a specific member info if the target user is not joined in the startup", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "helloasb@gmail.com",
      password: "asb1234",
      name: "Asbam",
      userName: "asb_1234",
    });

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members/${user.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 403,
      code: "SPECIFIED_USER_NOT_JOINED_IN_STARTUP",
      message: "The specified user is not joined in the startup.",
    });
  });

  test("Should not be able to get a specific member info if the startup doesnt exists", async () => {
    const firstUser = await createTestUser({
      email: "samira@gmail.com",
      userName: "samira_ali",
      name: "Samira",
    });

    const secondUser = await createTestUser({
      email: "secondsamira@gmail.com",
      userName: "fake_samira",
      name: "Khode samira",
    });

    const firstUserToken = await createAccessToken(firstUser.id);

    const id = uuid.v4();

    const response = await request(app)
      .get(`/startup/${id}/members/${secondUser.id}`)
      .set("Authorization", `Bearer ${firstUserToken}`);

    expectError(response, {
      status: 404,
      code: "STARTUP_DOESNT_EXIST",
      message: "Startup does not exists",
    });
  });

  test("Should fail if provided with invalid value for id param", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "secondsamira@gmail.com",
      userName: "fake_samira",
      name: "Khode samira",
      password: "samira1234",
    });

    await insertUserIntoStartup(startup.startup.id, user.id);

    const response = await request(app)
      .get(`/startup/invalid/members/${user.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "Invalid input for id param.",
    });
  });

  test("Should fail if provided with invalid value for memberid param", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "secondsamira@gmail.com",
      userName: "fake_samira",
      name: "Khode samira",
      password: "samira1234",
    });

    await insertUserIntoStartup(startup.startup.id, user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members/invalid`)
      .set("Authorization", `Bearer ${startup.token}`);

    expectError(response, {
      status: 400,
      code: "INVALID_PARAMETER",
      message: "Invalid input for memberid param.",
    });
  });

  test("Should not allow user to get specific member within a startup if provided with no authorization", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "secondsamira@gmail.com",
      userName: "fake_samira",
      name: "Khode samira",
      password: "samira1234",
    });

    await insertUserIntoStartup(startup.startup.id, user.id);

    const response = await request(app).get(
      `/startup/${startup.startup.id}/members/${user.id}`,
    );

    expectError(response, {
      status: 401,
      code: "NO_AUTHORIZATION",
      message: "No authorization",
    });
  });

  test("Should not allow a user to get all members withtin a startup if provided with invalid/expired token", async () => {
    const startup = await createTestStartup();

    const user = await createTestUser({
      email: "secondsamira@gmail.com",
      userName: "fake_samira",
      name: "Khode samira",
      password: "samira1234",
    });

    const id = uuid.v4();

    await insertUserIntoStartup(startup.startup.id, user.id);

    const response = await request(app)
      .get(`/startup/${startup.startup.id}/members/${user.id}`)
      .set("Authorization", `Bearer ${id}`);

    expectError(response, {
      status: 401,
      code: "INVALID_OR_EXPIRED_ACCESS_TOKEN",
      message: "Invalid or expired access token",
    });
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
