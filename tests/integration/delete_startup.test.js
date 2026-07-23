const db = require("../../database/db");
const app = require("../../app");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const createTestStartup = require("../helpers/createTestStartup");
const { createTestUser, createAccessToken } = require("../helpers/auth");
const createStartupWithoutMember = require("../helpers/createStartupWithoutMember");

describe("DELETE /startup/:id", () => {
  test("should be able to delete startup", async () => {
    const startup = await createTestStartup();

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body["message"]).toBe("successfully deleted startup");
  });

  test("should not be able to delete startup because of permission", async () => {
    const startup = await createJoinedStartup();

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(403);

    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("error");
    expect(response.body["error"]).toHaveProperty("message");
    expect(response.body["error"]).toHaveProperty("code");
    expect(response.body["error"]["message"]).toBe(
      "Only owner's can delete startups.",
    );
    expect(response.body["error"]["code"]).toBe("NO_PERMISSION");
  });

  test("should not be able to delete startup if not joined", async () => {
    const startup = await createStartupWithoutMember();

    const user = await createTestUser();

    const token = await createAccessToken(user.id);

    const response = await request(app)
      .delete(`/startup/${startup.startupData.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("error");
    expect(response.body["error"]).toHaveProperty("message");
    expect(response.body["error"]).toHaveProperty("code");
    expect(response.body["success"]).toBe(false);
    expect(response.body["error"]["message"]).toBe(
      "You are not joined in the startup",
    );
    expect(response.body["error"]["code"]).toBe("NOT_JOINED_IN_STARTUP");
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
