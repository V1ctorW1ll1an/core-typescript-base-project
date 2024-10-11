import { appendFile } from "fs/promises";
import { Logger } from "../Logger";

// Mock da função appendFile
jest.mock("fs/promises", () => ({
  appendFile: jest.fn(),
}));

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  it("should log an error message to the file", async () => {
    const errorMessage = "Test error message";

    // Chama o método logError
    await logger.logError(errorMessage);

    // Verifica se appendFile foi chamado com a mensagem correta
    expect(appendFile).toHaveBeenCalledWith(
      expect.any(String), // O caminho do arquivo (não precisamos validar aqui)
      expect.stringContaining(errorMessage) // A mensagem de erro
    );
  });

  it("should format the log message with a timestamp", async () => {
    const errorMessage = "Another test error";

    // Chama o método logError
    await logger.logError(errorMessage);

    // Verifica se appendFile foi chamado com o formato correto
    expect(appendFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringMatching(
        /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] ERROR: Another test error\n/
      )
    );
  });

  it("should handle errors when writing to the log file", async () => {
    // Simula um erro ao chamar appendFile
    (appendFile as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to write")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await logger.logError("Error that causes append failure");

    // Verifica se o erro foi logado no console
    expect(consoleSpy).toHaveBeenCalledWith(
      "Falha ao escrever no arquivo de log:",
      expect.any(Error)
    );

    consoleSpy.mockRestore(); // Restaura o console original
  });
});
