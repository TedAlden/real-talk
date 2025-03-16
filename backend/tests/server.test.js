import { jest } from "@jest/globals";

// Create the mock for app.js
const mockListen = jest.fn((port, callback) => {
  if (callback) callback();
  return { close: jest.fn() };
});

// Mock the app module
jest.unstable_mockModule("../src/app.js", () => {
  return {
    default: {
      listen: mockListen,
    },
  };
});

describe("Server", () => {
  let originalPortEnv;
  let consoleLogSpy;

  beforeAll(() => {
    originalPortEnv = process.env.PORT;
  });

  afterAll(() => {
    if (originalPortEnv) {
      process.env.PORT = originalPortEnv;
    } else {
      delete process.env.PORT;
    }
  });

  beforeEach(() => {
    jest.resetModules();
    mockListen.mockClear();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  test("should start on default port 5001 when PORT env var is not set", async () => {
    delete process.env.PORT;
    await import("../src/server.js");

    expect(mockListen).toHaveBeenCalledWith(5001, expect.any(Function));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Server is running on port: 5001"
    );
  });

  test("should start on the port specified in PORT env var", async () => {
    process.env.PORT = 8000;
    await import("../src/server.js");

    expect(mockListen).toHaveBeenCalledWith(8000, expect.any(Function));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Server is running on port: 8000"
    );
  });
});
