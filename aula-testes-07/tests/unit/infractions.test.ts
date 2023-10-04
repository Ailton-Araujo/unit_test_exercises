import { faker } from "@faker-js/faker";
import * as usersRepository from "../../src/users-repository";
import * as infractionRepository from "../../src/infractions-repository";
import { getInfractionsFrom } from "infractions-service";
import { User } from "@prisma/client";
import { getLevel } from "../integration/factories/user-infractions-factory";

describe("Infractions Service Tests", () => {
  it("should get infractions from user", async () => {
    const userData: User = {
      id: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      licenseId: faker.vehicle.vin(),
    };
    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return userData;
      });
    const infractions = {
      userId: userData.id,
      date: new Date(),
      cost: faker.number.int({ min: 100, max: 1000 }),
      level: getLevel(),
      description: faker.company.catchPhrase(),
    };
    jest
      .spyOn(infractionRepository, "getInfractionsFrom")
      .mockImplementationOnce((): any => {
        return infractions;
      });

    const result = await getInfractionsFrom(userData.licenseId);
    expect(result).toEqual({
      ...userData,
      infractions,
    });
  });

  it("should throw an error when driver license does not exists", () => {
    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    const invalidLicenseId: string = "invalidLicense";

    const promise = getInfractionsFrom(invalidLicenseId);
    expect(promise).rejects.toEqual({
      type: "NOT_FOUND",
      message: "Driver not found.",
    });
  });
});
