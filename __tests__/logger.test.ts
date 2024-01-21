import LoggerClass from "../src/index";
import * as fs from "fs";

jest.mock("fs", () => {
  return {
    createWriteStream: jest.fn().mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
    }),
  };
});

describe("Logger - File Logging", () => {
  let consoleDebugSpy: jest.SpyInstance;
  let fileWriteSpy: jest.SpyInstance;
  let Logger: LoggerClass;
  const testFilePath = "/path/to/test/logfile.log";

  beforeAll(() => {
    Logger = LoggerClass.getInstance("DEBUG", testFilePath);
    consoleDebugSpy = jest.spyOn(console, "debug");
    fileWriteSpy = jest.spyOn(fs.createWriteStream(testFilePath), "write");
  });

  beforeEach(() => {
    consoleDebugSpy.mockClear();
    fileWriteSpy.mockClear();
  });

  it("should write DEBUG message to file", () => {
    const message = "This is a debug message.";
    Logger.debug("TestModule", message);
    expect(fileWriteSpy).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it("should write INFO message to file", () => {
    const message = "This is an info message.";
    Logger.info("TestModule", message);
    expect(fileWriteSpy).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});

describe("Logger - Console Logging", () => {
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let Logger: LoggerClass;

  beforeAll(() => {
    Logger = LoggerClass.getInstance("DEBUG");
  });

  beforeEach(() => {
    consoleInfoSpy = jest.spyOn(console, "info");
    consoleWarnSpy = jest.spyOn(console, "warn");
    consoleErrorSpy = jest.spyOn(console, "error");
    consoleDebugSpy = jest.spyOn(console, "debug");
  });

  afterEach(() => {
    consoleInfoSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
    consoleDebugSpy.mockClear();
  });

  it("should print DEBUG message", () => {
    Logger.debug("TestModule", "This is a debug message.");
    expect(consoleDebugSpy).toHaveBeenCalled();
  });

  it("should print INFO message", () => {
    Logger.info("TestModule", "This is an info message");
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it("should print WARN message", () => {
    Logger.warn("TestModule", "This is a warn message.");
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it("should print ERROR message", () => {
    Logger.error("TestModule", "This is an error message.");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should print exception error", () => {
    Logger.exception(
      "TestModule",
      new Error("Some error"),
      "Exception Occurred"
    );
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should not print DEBUG message", () => {
    Logger.setLogLevel("INFO");
    Logger.debug("TestModule", "This is a debug message.");
    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });

  it("should not print INFO message", () => {
    Logger.setLogLevel("WARN");
    Logger.info("TestModule", "This is an info message");
    expect(consoleInfoSpy).not.toHaveBeenCalled();
  });

  it("should not print WARN message", () => {
    Logger.setLogLevel("ERROR");
    Logger.warn("TestModule", "This is a warn message.");
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it("should not print ERROR message", () => {
    Logger.setLogLevel("NONE");
    Logger.error("TestModule", "This is an error message.");
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
