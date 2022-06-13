const request = require("supertest");
const app = require("../../../../app");
const emailAdmin = "admin@gmail.com";
const emailCustomer = "customer@gmail.com";
const password = "123";

describe("PUT /v1/cars/:id", () => {
  let car, tokenAdmin, tokenCustomer;

  const createCar = {
    name: "Car",
    price: 100000,
    size: "S",
    image: "https://source.unsplash.com/500x500",
  };

  beforeAll(async () => {
    tokenAdmin = await request(app).post("/v1/auth/login").send({
      email: emailAdmin,
      password,
    });
    tokenCustomer = await request(app).post("/v1/auth/login").send({
      email: emailCustomer,
      password,
    });

    car = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${tokenAdmin.body.accessToken}`)
      .send(createCar);

    return car, tokenAdmin, tokenCustomer;
  });

  it("should response with 200 as status code", async () => {
    const response = await request(app)
      .put("/v1/cars/" + car.body.id)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${tokenAdmin.body.accessToken}`)
      .send(createCar);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({}));
  });

  it("should response with 401 as status code", async () => {
    const response = await request(app)
      .put("/v1/cars/" + car.body.id)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${tokenCustomer.body.accessToken}`)
      .send(createCar);

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
  afterEach(async () => {
    return request(app)
      .delete("/v1/cars/" + car.body.id)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${tokenAdmin.body.accessToken}`);
  });
});
