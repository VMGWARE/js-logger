/***************************************************************************************
 *    Title: Uptime Kuma
 *    Author: Uptime Kuma
 *    Date: 2024-1-1
 *    Code version: 1.23.11
 *    Availability: https://github.com/louislam/uptime-kuma/blob/master/src/util.ts
 *
 ***************************************************************************************/

// Dependencies
import dayjs from "dayjs";
import "dotenv/config";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as fs from "fs";

// Dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Environment variables
const isNode = typeof process !== "undefined" && process?.versions?.node;

// Console colors
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const CONSOLE_STYLE_Reset = "\x1b[0m";
const CONSOLE_STYLE_FgRed = "\x1b[31m";
const CONSOLE_STYLE_FgGreen = "\x1b[32m";
const CONSOLE_STYLE_FgYellow = "\x1b[33m";
const CONSOLE_STYLE_FgBlue = "\x1b[34m";
const CONSOLE_STYLE_FgMagenta = "\x1b[35m";
const CONSOLE_STYLE_FgCyan = "\x1b[36m";
const CONSOLE_STYLE_FgGray = "\x1b[90m";
const CONSOLE_STYLE_FgOrange = "\x1b[38;5;208m";
const CONSOLE_STYLE_FgLightGreen = "\x1b[38;5;119m";
const CONSOLE_STYLE_FgLightBlue = "\x1b[38;5;117m";
const CONSOLE_STYLE_FgViolet = "\x1b[38;5;141m";
const CONSOLE_STYLE_FgBrown = "\x1b[38;5;130m";
const CONSOLE_STYLE_FgPink = "\x1b[38;5;219m";

const consoleModuleColors = [
  CONSOLE_STYLE_FgCyan,
  CONSOLE_STYLE_FgGreen,
  CONSOLE_STYLE_FgLightGreen,
  CONSOLE_STYLE_FgBlue,
  CONSOLE_STYLE_FgLightBlue,
  CONSOLE_STYLE_FgMagenta,
  CONSOLE_STYLE_FgOrange,
  CONSOLE_STYLE_FgViolet,
  CONSOLE_STYLE_FgBrown,
  CONSOLE_STYLE_FgPink,
];

const consoleLevelColors: Record<string, string> = {
  INFO: CONSOLE_STYLE_FgCyan,
  WARN: CONSOLE_STYLE_FgYellow,
  ERROR: CONSOLE_STYLE_FgRed,
  DEBUG: CONSOLE_STYLE_FgGray,
};

class Logger {
  /**
   * Singleton instance
   */
  private static instance: Logger;

  /**
   * Log level
   */
  private logLevel: string;

  /**
   * Log file path
   */
  private logFilePath: string | null;

  /**
   * Log file stream
   */
  private fileStream: fs.WriteStream | null = null;

  /**
   * @class Logger
   * @description The logger class is used to write logs to the console
   * @param logLevel Log level (default: info)
   * @param logFilePath Log file path (default: null)
   */
  private constructor(logLevel: string = "INFO", logFilePath?: string) {
    this.logLevel = logLevel.toUpperCase();
    this.logFilePath = logFilePath ?? null;

    if (this.logFilePath) {
      // Initialize file stream only if logFilePath is provided
      this.fileStream = fs.createWriteStream(this.logFilePath, { flags: "a" });
    }
  }

  /**
   * Get the singleton instance of the logger
   * @param logLevel Log level (default: info)
   * @param logFilePath Log file path (default: null)
   * @returns {Logger} Logger instance
   */
  public static getInstance(logLevel?: string, logFilePath?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel, logFilePath);
    }
    return Logger.instance;
  }

  /**
   * Write a message to the log file
   * @param message Message to write
   * @returns {void}
   */
  private writeToFile(message: string): void {
    if (this.fileStream) {
      this.fileStream.write(message + "\n");
    }
  }

  /**
   * Write a message to the log
   * @param module The module the log comes from
   * @param msg Message to write
   * @param level Log level. One of INFO, WARN, ERROR, DEBUG or can be customized.
   * @returns {void}
   */
  log(module: string, msg: any, level: string) {
    module = module.toUpperCase();
    level = level.toUpperCase();

    // Define levelPriority with an index signature
    const levelPriority: { [key: string]: number } = {
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      NONE: 5,
    };

    if (levelPriority[level] < levelPriority[this.logLevel]) {
      return;
    }

    let now;
    if (dayjs.tz) {
      now = dayjs.tz(new Date()).format();
    } else {
      now = dayjs().format();
    }

    const levelColor = consoleLevelColors[level];
    const moduleColor =
      consoleModuleColors[intHash(module, consoleModuleColors.length)];

    let timePart: string;
    let modulePart: string;
    let levelPart: string;
    let msgPart: string;

    if (isNode) {
      // Add console colors
      if (level === "DEBUG") {
        timePart = CONSOLE_STYLE_FgGray + now + CONSOLE_STYLE_Reset;
      } else {
        timePart = CONSOLE_STYLE_FgCyan + now + CONSOLE_STYLE_Reset;
      }

      modulePart = "[" + moduleColor + module + CONSOLE_STYLE_Reset + "]";

      levelPart = levelColor + `${level}:` + CONSOLE_STYLE_Reset;

      switch (level) {
        case "ERROR":
          if (typeof msg === "string") {
            msgPart = CONSOLE_STYLE_FgRed + msg + CONSOLE_STYLE_Reset;
          } else {
            msgPart = msg;
          }
          break;
        case "DEBUG":
          if (typeof msg === "string") {
            msgPart = CONSOLE_STYLE_FgGray + msg + CONSOLE_STYLE_Reset;
          } else {
            msgPart = msg;
          }
          break;
        default:
          msgPart = msg;
          break;
      }
    } else {
      // No console colors
      timePart = now;
      modulePart = `[${module}]`;
      levelPart = `${level}:`;
      msgPart = msg;
    }

    // Write to console
    switch (level) {
      case "ERROR":
        console.error(timePart, modulePart, levelPart, msgPart);
        break;
      case "WARN":
        console.warn(timePart, modulePart, levelPart, msgPart);
        break;
      case "INFO":
        console.info(timePart, modulePart, levelPart, msgPart);
        break;
      case "DEBUG":
        console.debug(timePart, modulePart, levelPart, msgPart);
        break;
      default:
        console.log(timePart, modulePart, levelPart, msgPart);
        break;
    }

    // Format for log file
    const formattedMessage = `${timePart} ${modulePart} ${levelPart} ${msgPart}`;

    // Conditional write to file
    this.writeToFile(formattedMessage);
  }

  /**
   * Log an INFO message
   * @param module Module log comes from
   * @param msg Message to write
   * @returns {void}
   */
  info(module: string, msg: unknown) {
    this.log(module, msg, "info");
  }

  /**
   * Log a WARN message
   * @param module Module log comes from
   * @param msg Message to write
   * @returns {void}
   */
  warn(module: string, msg: unknown) {
    this.log(module, msg, "warn");
  }

  /**
   * Log an ERROR message
   * @param module Module log comes from
   * @param msg Message to write
   * @returns {void}
   */
  error(module: string, msg: unknown) {
    this.log(module, msg, "error");
  }

  /**
   * Log a DEBUG message
   * @param module Module log comes from
   * @param msg Message to write
   * @returns {void}
   */
  debug(module: string, msg: unknown) {
    this.log(module, msg, "debug");
  }

  /**
   * Log an exception as an ERROR
   * @param module Module log comes from
   * @param exception The exception to include
   * @param msg The message to write
   * @returns {void}
   */
  exception(module: string, exception: unknown, msg: unknown) {
    let finalMessage = exception;

    if (msg) {
      finalMessage = `${msg}: ${exception}`;
    }

    this.log(module, finalMessage, "error");
  }

  /**
   * Set the log level
   * @param level Log level
   * @returns {void}
   */
  setLogLevel(level: string) {
    this.logLevel = level.toUpperCase();
  }

  /**
   * Close the log file stream
   * @returns {void}
   */
  close(): void {
    if (this.fileStream) {
      this.fileStream.end();
    }
  }
}

/**
 * Generate a decimal integer number from a string
 * @param str Input
 * @param length Default is 10 which means 0 - 9
 * @returns {number} output number
 */
function intHash(str: string, length = 10): number {
  // A simple hashing function (you can use more complex hash functions if needed)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  // Normalize the hash to the range [0, 10]
  return ((hash % length) + length) % length; // Ensure the result is non-negative
}

// Handle application shutdown events to close the file stream
process.on("exit", () => Logger.getInstance().close());
process.on("SIGINT", () => Logger.getInstance().close());
process.on("uncaughtException", () => Logger.getInstance().close());

// Export class
export default Logger;
