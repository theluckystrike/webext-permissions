# @zovo/webext-permissions

Runtime permission checking and requesting for Chrome extensions. Wraps the `chrome.permissions` API with type-safe helpers, human-readable descriptions, and user-friendly error handling.

Part of the [@zovo/webext](https://zovo.one) toolkit.

## Install

```bash
npm install @zovo/webext-permissions
```

## Quick Start

```ts
import {
  checkPermission,
  requestPermission,
  getGrantedPermissions,
} from "@zovo/webext-permissions";

// Check if a permission is granted
const { granted } = await checkPermission("tabs");

// Request a permission (must be called from a user gesture)
document.getElementById("btn")!.addEventListener("click", async () => {
  const result = await requestPermission("notifications");
  if (result.granted) {
    console.log("Permission granted!");
  } else {
    console.log("Denied:", result.error);
  }
});

// List all currently granted permissions
const granted = await getGrantedPermissions();
granted.forEach((p) => console.log(p.permission, "-", p.description));
```

## API Reference

### Types

```ts
interface PermissionResult {
  permission: string;
  granted: boolean;
  description: string; // Human-readable description
}

interface RequestResult {
  granted: boolean;
  error?: string; // Present when the request fails
}
```

### `describePermission(permission: string): string`

Returns a human-readable description for a Chrome permission string. Falls back to a generic description for unknown permissions.

```ts
describePermission("tabs"); // "Read information about open tabs"
describePermission("unknown"); // 'Use the "unknown" API'
```

### `listPermissions(): PermissionResult[]`

Returns all known Chrome permissions with their descriptions. The `granted` field is always `false` -- use `checkPermissions()` for live status.

### `checkPermission(permission: string): Promise<PermissionResult>`

Checks whether a single permission is currently granted.

```ts
const result = await checkPermission("storage");
// { permission: "storage", granted: true, description: "Store and retrieve data locally" }
```

### `checkPermissions(permissions: string[]): Promise<PermissionResult[]>`

Batch-checks multiple permissions at once. Returns results in the same order as the input array.

```ts
const results = await checkPermissions(["tabs", "history", "storage"]);
results.forEach((r) => console.log(r.permission, r.granted));
```

### `requestPermission(permission: string): Promise<RequestResult>`

Requests a single optional permission. Must be called from a user gesture (e.g., click handler). Returns `{ granted: true }` on success, or `{ granted: false, error: "..." }` on failure.

### `requestPermissions(permissions: string[]): Promise<RequestResult>`

Requests multiple permissions in a single browser prompt.

### `removePermission(permission: string): Promise<boolean>`

Removes a previously granted permission. Returns `true` if removal succeeded.

### `getGrantedPermissions(): Promise<PermissionResult[]>`

Returns all currently granted permissions with human-readable descriptions.

### `PERMISSION_DESCRIPTIONS: Record<string, string>`

The raw mapping of permission names to human-readable descriptions. Useful for building custom UIs.

## Requirements

- Chrome extension environment with `chrome.permissions` API access
- Permissions must be declared as `optional_permissions` in `manifest.json` to be requestable at runtime

## License

MIT

---

Built with [Zovo](https://zovo.one)
