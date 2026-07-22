const db = require("../../database/db");
const app = require("../../app");
const request = require("supertest");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");
const createTestStartup = require("../helpers/createTestStartup");

describe("DELETE /startup/:id", () => {
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

  test("should be able to delete startup", async () => {
    const startup = await createTestStartup();

    const response = await request(app)
      .delete(`/startup/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body["message"]).toBe("successfully deleted startup");
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
