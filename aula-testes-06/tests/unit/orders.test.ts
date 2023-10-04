import { faker } from "@faker-js/faker";

import { createOrder, getOrderByProtocol } from "../../src/order-service";
import * as orderRepository from "../../src/order-repository";
import { OrderInput } from "../../src/validator";

describe("Order Service Tests", () => {
  it("should create an order", async () => {
    const protocolData = { protocol: "mock test", status: "IN_PREPARATION" };
    jest.spyOn(orderRepository, "create").mockImplementationOnce((): any => {
      return protocolData;
    });

    const orderInput: OrderInput = {
      client: faker.person.fullName(),
      description: faker.commerce.productDescription(),
    };

    const response = await createOrder(orderInput);

    expect(response).toEqual(protocolData);
  });

  it("should return an order based on the protocol", async () => {
    const protocolData = { protocol: "mock test", status: "IN_PREPARATION" };
    jest
      .spyOn(orderRepository, "getByProtocol")
      .mockImplementationOnce((): any => {
        return protocolData;
      });

    const response = await getOrderByProtocol(protocolData.protocol);

    expect(response).toEqual(protocolData);
  });

  it("should return status INVALID when protocol doesn't exists", async () => {
    jest
      .spyOn(orderRepository, "getByProtocol")
      .mockImplementationOnce((): any => {
        return undefined;
      });
    const invalidProtocol: string = "invalid protocol";
    const response = await getOrderByProtocol(invalidProtocol);
    expect(response).toEqual({
      protocol: invalidProtocol,
      status: "INVALID",
    });
  });
});
