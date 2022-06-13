const request = require("supertest");
const app = require("../../../app");
const email = `customer${Math.random().toString().substring(12)}@gmail.com`;

describe("POST /v1/auth/register", () => {
  it("should response with 201 as status code", async () => {
    const name = "customer";
    const password = "123";

    const response = await request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send({ name, email, password });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      })
    );
  });

  it("should response with 422 as status code", async () => {
    const name = "";
    const password = "";

    const response = await request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send({ name, email, password });

    expect(response.statusCode).toBe(422);
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
});
