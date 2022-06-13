const request = require("supertest");
const app = require("../../../../app");
const dayjs = require("dayjs");
dayjs().format();

const emailAdmin = "admin@gmail.com";
const emailCustomer = "customer@gmail.com";
const password = "123";
const wrongToken = "wrongToken";

describe("POST /v1/cars/:id/rent", () => {
  let car, TokenAdmin, TokenCustomer;
  let rentStartedAt = dayjs().add(1, "day");
  let rentEndedAt = dayjs(rentStartedAt).add(1, "day");
  const createCar = {
    name: "Car",
    price: 100000,
    size: "s",
    image: "https://source.unsplash.com/500x500",
  };

  beforeAll(async () => {
    TokenAdmin = await request(app).post("/v1/auth/login").send({
      email: emailAdmin,
      password,
    });
    TokenCustomer = await request(app).post("/v1/auth/login").send({
      email: emailCustomer,
      password,
    });

    car = await request(app)
      .post("/v1/cars")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${TokenAdmin.body.accessToken}`)
      .send(createCar);

    return car, TokenAdmin, TokenCustomer;
  });

  it("should response with 201 as status code", async () => {
    rentStartedAt = rentStartedAt.$d;
    rentEndedAt = rentEndedAt.$d;

    const response = await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${TokenCustomer.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        userId: expect.any(Number),
        carId: expect.any(Number),
        rentStartedAt: expect.any(String),
        rentEndedAt: expect.any(String),
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      })
    );
  });

  it("should response with 422 as status code", async () => {
    const response = await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${TokenCustomer.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt });

    expect(response.statusCode).toBe(422);
    expect(response.body).toEqual(response.body);
  });

  it("should response with 401 as status code", async () => {
    rentStartedAt = rentStartedAt.$d;
    rentEndedAt = rentEndedAt.$d;

    const response = await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", `Bearer ${TokenAdmin.body.accessToken}`)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          name: expect.any(String),
          message: expect.any(String),
          details: expect.objectContaining({
            role: expect.any(String),
            reason: expect.any(String),
          }),
        }),
      })
    );
  });

  it("should response with 401 as status code", async () => {
    const response = await request(app)
      .post("/v1/cars/" + car.body.id + "/rent")
      .set("Authorization", wrongToken)
      .set("Content-Type", "application/json")
      .send({ rentStartedAt, rentEndedAt });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({
          name: expect.any(String),
          message: expect.any(String),
          details: null,
        }),
      })
    );
  });
});
