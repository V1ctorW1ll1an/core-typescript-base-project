import { appendFile } from "fs/promises";
import { join } from "path";

export class Logger {
  private logFilePath: string;

  constructor() {
    // Define o caminho do arquivo de log
    this.logFilePath = join(__dirname, "log.txt");
  }

  public async logError(message: string): Promise<void> {
    const logMessage = `[${new Date().toISOString()}] ERROR: ${message}\n`;

    try {
      // Escreve o log no arquivo (append para não sobrescrever)
      await appendFile(this.logFilePath, logMessage);
    } catch (error) {
      console.error("Falha ao escrever no arquivo de log:", error);
    }
  }
}
