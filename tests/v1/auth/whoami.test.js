const request = require("supertest");
const app = require("../../../app");
const emailCustomer = "customer@gmail.com";
const password = "123";
const emailAdmin = "admin@gmail.com";

describe("GET /v1/auth/whoami", () => {
  it("should response with 200 as status code", async () => {
    const accessToken = await request(app).post("/v1/auth/login").send({
      email: emailCustomer,
      password,
    });

    const response = await request(app)
      .get("/v1/auth/whoami")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`);

    expect(response.status).toBe(200);
    if (response.body.image === null) {
      expect(response.body).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        image: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      return;
    }
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      image: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should response with 401 as status code", async () => {
    const response = await request(app)
      .get("/v1/auth/whoami")
      .set("Authorization", "Bearer tokenerror");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        name: expect.any(String),
        message: expect.any(String),
        details: null,
      },
    });
  });

  it("should response with 401 as status code", async () => {
    const accessToken = await request(app).post("/v1/auth/login").send({
      email: emailAdmin,
      password,
    });

    const response = await request(app)
      .get("/v1/auth/whoami")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      error: {
        name: expect.any(String),
        message: expect.any(String),
        details: expect.objectContaining({
          role: expect.any(String),
          reason: expect.any(String),
        }),
      },
    });
  });
});
