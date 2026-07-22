const db = require("../../database/db");
const request = require("supertest");
const app = require("../../app");
const cleanDatabase = require("../helpers/cleanDatabase");
const { createJoinedStartup } = require("../helpers/createdJoinedStartup");

describe("POST /startup/join/:id", () => {
  test("should join startup", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.body).toHaveProperty("message");

    expect(typeof startup.response.body["message"]).toBe("string");

    expect(startup.response.body["message"]).toBe(
      "joined startup successfully",
    );

    expect(startup.response.status).toBe(200);
  });

  test("should join startup", async () => {
    const startup = await createJoinedStartup();

    expect(startup.response.status).toBe(200);

    expect(startup.response.body).toHaveProperty("message");

    expect(typeof startup.response.body["message"]).toBe("string");

    expect(startup.response.body["message"]).toBe(
      "joined startup successfully",
    );

    const response = await request(app)
      .post(`/startup/join/${startup.startup.id}`)
      .set("Authorization", `Bearer ${startup.token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("success");
    expect(response.body).toHaveProperty("error");
    expect(response.body["error"]).toHaveProperty("message");
    expect(response.body["error"]).toHaveProperty("code");
    expect(response.body["error"]["code"]).toBe("ALREADY_JOINED_STARTUP");
    expect(response.body["error"]["message"]).toBe(
      "You already joined the startup",
    );
  });

  beforeEach(async () => {
    await cleanDatabase();
  });
});
