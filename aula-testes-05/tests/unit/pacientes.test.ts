import { string } from "joi";
import { generateProtocolForPacient } from "../../src/protocols-generator";

jest.mock("uuid", () => {
  return {
    v4: () => {
      return "valor simulado do protocolo";
    },
  };
});

describe("Pacient Service", () => {
  it("test pacient protocol", async () => {
    const firstName = "Teste";
    const lastName = "dos Testes";
    const priority = true;

    const protocol = generateProtocolForPacient(firstName, lastName, priority);
    console.log(protocol);
    expect(protocol).toEqual({
      priority,
      date: expect.any(Date),
      pacient: `${firstName} ${lastName}`,
      protocol: "valor simulado do protocolo",
    });
  });
});
