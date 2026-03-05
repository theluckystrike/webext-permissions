import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  describePermission,
  listPermissions,
  checkPermission,
  checkPermissions,
  requestPermission,
  requestPermissions,
  removePermission,
  getGrantedPermissions,
  PERMISSION_DESCRIPTIONS,
} from "../src/index";

// Mock chrome.permissions API
const mockChrome = {
  permissions: {
    contains: vi.fn(),
    request: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(),
  },
  runtime: {
    lastError: null as { message: string } | null,
  },
};

vi.stubGlobal("chrome", mockChrome);

beforeEach(() => {
  vi.clearAllMocks();
  mockChrome.runtime.lastError = null;
});

describe("describePermission", () => {
  it("returns description for known permissions", () => {
    expect(describePermission("tabs")).toBe("Read information about open tabs");
    expect(describePermission("storage")).toBe(
      "Store and retrieve data locally",
    );
  });

  it("returns fallback for unknown permissions", () => {
    expect(describePermission("someFutureApi")).toBe(
      'Use the "someFutureApi" API',
    );
  });
});

describe("listPermissions", () => {
  it("returns all known permissions with descriptions", () => {
    const list = listPermissions();
    expect(list.length).toBe(Object.keys(PERMISSION_DESCRIPTIONS).length);
    expect(list[0]).toHaveProperty("permission");
    expect(list[0]).toHaveProperty("description");
    expect(list[0].granted).toBe(false);
  });
});

describe("checkPermission", () => {
  it("returns granted: true when permission is granted", async () => {
    mockChrome.permissions.contains.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(true),
    );

    const result = await checkPermission("tabs");
    expect(result).toEqual({
      permission: "tabs",
      granted: true,
      description: "Read information about open tabs",
    });
  });

  it("returns granted: false when permission is not granted", async () => {
    mockChrome.permissions.contains.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(false),
    );

    const result = await checkPermission("history");
    expect(result.granted).toBe(false);
  });
});

describe("checkPermissions", () => {
  it("batch-checks multiple permissions", async () => {
    mockChrome.permissions.contains.mockImplementation(
      (req: { permissions: string[] }, cb: (result: boolean) => void) => {
        cb(req.permissions[0] === "tabs");
      },
    );

    const results = await checkPermissions(["tabs", "history"]);
    expect(results).toHaveLength(2);
    expect(results[0].granted).toBe(true);
    expect(results[1].granted).toBe(false);
  });
});

describe("requestPermission", () => {
  it("returns granted: true on success", async () => {
    mockChrome.permissions.request.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(true),
    );

    const result = await requestPermission("notifications");
    expect(result).toEqual({ granted: true });
  });

  it("returns granted: false when user denies", async () => {
    mockChrome.permissions.request.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(false),
    );

    const result = await requestPermission("notifications");
    expect(result).toEqual({ granted: false });
  });

  it("returns error on runtime error", async () => {
    mockChrome.permissions.request.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => {
        mockChrome.runtime.lastError = {
          message: "Must be called from a user gesture",
        };
        cb(false);
        mockChrome.runtime.lastError = null;
      },
    );

    const result = await requestPermission("notifications");
    expect(result.granted).toBe(false);
    expect(result.error).toBe("Must be called from a user gesture");
  });
});

describe("requestPermissions", () => {
  it("requests multiple permissions in one prompt", async () => {
    mockChrome.permissions.request.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(true),
    );

    const result = await requestPermissions(["tabs", "history"]);
    expect(result.granted).toBe(true);
    expect(mockChrome.permissions.request).toHaveBeenCalledWith(
      { permissions: ["tabs", "history"] },
      expect.any(Function),
    );
  });
});

describe("removePermission", () => {
  it("returns true when removal succeeds", async () => {
    mockChrome.permissions.remove.mockImplementation(
      (_req: unknown, cb: (result: boolean) => void) => cb(true),
    );

    const result = await removePermission("tabs");
    expect(result).toBe(true);
  });
});

describe("getGrantedPermissions", () => {
  it("returns all granted permissions with descriptions", async () => {
    mockChrome.permissions.getAll.mockImplementation(
      (cb: (perms: { permissions: string[] }) => void) =>
        cb({ permissions: ["tabs", "storage"] }),
    );

    const results = await getGrantedPermissions();
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      permission: "tabs",
      granted: true,
      description: "Read information about open tabs",
    });
    expect(results[1]).toEqual({
      permission: "storage",
      granted: true,
      description: "Store and retrieve data locally",
    });
  });

  it("handles empty permissions", async () => {
    mockChrome.permissions.getAll.mockImplementation(
      (cb: (perms: { permissions: string[] }) => void) =>
        cb({ permissions: [] }),
    );

    const results = await getGrantedPermissions();
    expect(results).toHaveLength(0);
  });
});
