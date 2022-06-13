const request = require("supertest");
const app = require("../../../app");

describe("POST /v1/create", () => {
  it("should response with 201 as status code", async () => {
    const accessToken = await request(app).post("/v1/auth/login").send({
      email: "admin@gmail.com",
      password: "123",
    });

    const name = "Honda";
    const price = "100000";
    const image = `https://source.unsplash.com/${Math.floor(
      Math.random() * 500
    )}x${Math.floor(Math.random() * 500)}`;
    const size = "Medium";

    const response = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
      .send({ name, price, image, size });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      price: expect.any(Number),
      size: expect.any(String),
      image: expect.any(String),
      isCurrentlyRented: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should response with 401 as status code", async () => {
    const accessToken = await request(app).post("/v1/auth/login").send({
      email: "customer@gmail.com",
      password: "123",
    });

    const name = "Honda";
    const price = "100000";
    const image = `https://source.unsplash.com/720x480`;
    const size = "Medium";

    const response = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
      .send({ name, price, image, size });

    expect(response.status).toBe(401);
    if (response.body.details === null) {
      expect(response.body).toEqual({
        error: expect.objectContaining({
          name: expect.any(String),
          message: expect.any(String),
          details: null,
        }),
      });
      return;
    }
    expect(response.body).toEqual({
      error: expect.objectContaining({
        name: expect.any(String),
        message: expect.any(String),
        details: expect.objectContaining({
          role: expect.any(String),
          reason: expect.any(String),
        }),
      }),
    });
  });
});
