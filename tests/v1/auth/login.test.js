const request = require("supertest");
const app = require("../../../app");
const email = "customer@gmail.com";
const password = "123";
const wrongEmail = "wrongEmail@gmail.com";
const wrongPassword = "wrongPassword";

describe("POST /v1/auth/login", () => {
  it("should response with 201 as status code", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });

  it("should response with 404 as status code", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email: wrongEmail, password });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: {
            email: expect.any(String),
          },
        },
      })
    );
  });

  it("should response with 401 as status code", async () => {
    const response = await request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password: wrongPassword });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: expect.any(Object),
        },
      })
    );
  });
});
