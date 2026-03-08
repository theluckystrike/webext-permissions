<div align="center">

# @theluckystrike/webext-permissions

Runtime permission checking and requesting for Chrome extensions. Typed, promise-based helpers for the `chrome.permissions` API with human-readable permission descriptions.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-permissions?color=blue)](https://www.npmjs.com/package/@theluckystrike/webext-permissions)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-permissions)](https://www.npmjs.com/package/@theluckystrike/webext-permissions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![tested with vitest](https://img.shields.io/badge/tested%20with-vitest-6cadf4.svg)](https://vitest.dev/)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-permissions)](https://bundlephobia.com/package/@theluckystrike/webext-permissions)

[Installation](#installation) · [Quick Start](#quick-start) · [API Reference](#api-reference) · [Examples](#examples) · [Chrome Extension Guide](#chrome-extension-guide) · [License](#license)

</div>

---

## Why This Package?

Managing optional permissions in Chrome extensions can be verbose and error-prone. This library provides:

- **Human-readable descriptions** for all 54 Chrome permission strings
- **Promise-based API** instead of callback-based chrome.permissions
- **TypeScript support** with full type inference
- **Error handling** with meaningful error messages
- **Batch operations** for checking or requesting multiple permissions at once

## Features

- **Check Permissions** — Verify if permissions are granted with descriptive results
- **Request Permissions** — Prompt users for optional permissions with proper error handling
- **Remove Permissions** — Revoke granted permissions programmatically
- **Permission Descriptions** — Get human-readable explanations for any Chrome permission
- **Batch Operations** — Check or request multiple permissions efficiently
- **Full TypeScript** — Complete type definitions with IntelliSense support
- **Promise-based** — Modern async/await API for all operations
- **Tiny Bundle** — Under 2KB minified and gzipped

## Installation

```bash
npm install @theluckystrike/webext-permissions
```

<details>
<summary>Other package managers</summary>

```bash
# pnpm
pnpm add @theluckystrike/webext-permissions

# yarn
yarn add @theluckystrike/webext-permissions
```

</details>

## Quick Start

```typescript
import {
  checkPermission,
  requestPermission,
  removePermission,
  describePermission,
} from "@theluckystrike/webext-permissions";

// Check if a permission is granted
const hasTabs = await checkPermission("tabs");
console.log(hasTabs);
// { permission: "tabs", granted: true, description: "Read information about open tabs" }

// Request a permission (must be called from user gesture)
const result = await requestPermission("bookmarks");
if (result.granted) {
  console.log("Bookmarks permission granted!");
} else {
  console.log("User denied or error:", result.error);
}

// Get human-readable description for any permission
console.log(describePermission("activeTab"));
// "Access the currently active tab when you click the extension"

// Remove a permission when no longer needed
await removePermission("tabs");
```

---

## API Reference

### Types

```typescript
interface PermissionResult {
  permission: string;
  granted: boolean;
  description: string;
}

interface RequestResult {
  granted: boolean;
  error?: string;
}
```

### Functions

#### `describePermission(permission: string): string`

Returns a human-readable description for any Chrome permission string. Unknown permissions get a generic fallback description.

```typescript
describePermission("activeTab");
// "Access the currently active tab when you click the extension"

describePermission("tabs");
// "Read information about open tabs"

describePermission("unknownPermission");
// 'Use the "unknownPermission" API'
```

#### `listPermissions(): PermissionResult[]`

Returns all 54 known Chrome permissions with their descriptions. The `granted` field is always `false` in this static listing. Use `checkPermissions` for live data.

```typescript
const allPermissions = listPermissions();
console.log(allPermissions.length); // 54

console.log(allPermissions[0]);
// { permission: "activeTab", granted: false, description: "Access the currently active tab..." }
```

#### `checkPermission(permission: string): Promise<PermissionResult>`

Checks whether a single permission is currently granted. Returns a Promise with the permission details including its human-readable description.

```typescript
const result = await checkPermission("storage");
console.log(result);
// { permission: "storage", granted: true, description: "Store and retrieve data locally" }
```

#### `checkPermissions(permissions: string[]): Promise<PermissionResult[]>`

Batch-checks multiple permissions at once. Returns results in the same order as the input array.

```typescript
const results = await checkPermissions(["tabs", "storage", "cookies"]);
results.forEach(({ permission, granted }) => {
  console.log(`${permission}: ${granted ? "granted" : "not granted"}`);
});
```

#### `requestPermission(permission: string): Promise<RequestResult>`

Requests a single optional permission from the user. Must be called from a user gesture (click handler, keyboard shortcut, etc.).

```typescript
const result = await requestPermission("bookmarks");
if (result.granted) {
  console.log("Permission granted!");
} else if (result.error) {
  console.error("Request failed:", result.error);
} else {
  console.log("User denied the request");
}
```

#### `requestPermissions(permissions: string[]): Promise<RequestResult>`

Requests multiple permissions in a single browser prompt. All or nothing — if the user denies any, none are granted.

```typescript
const result = await requestPermissions(["tabs", "bookmarks", "history"]);
if (result.granted) {
  console.log("All permissions granted!");
}
```

#### `removePermission(permission: string): Promise<boolean>`

Removes a previously granted optional permission. Returns `true` if successful.

```typescript
const removed = await removePermission("tabs");
if (removed) {
  console.log("Permission removed");
}
```

#### `getGrantedPermissions(): Promise<PermissionResult[]>`

Returns all permissions currently granted to the extension, with human-readable descriptions.

```typescript
const granted = await getGrantedPermissions();
granted.forEach(({ permission, description }) => {
  console.log(`${permission}: ${description}`);
});
```

---

## Examples

### Checking Permissions Before Use

```typescript
import { checkPermissions } from "@theluckystrike/webext-permissions";

async function doSomethingRequiringTabs() {
  const results = await checkPermissions(["tabs", "history"]);
  const hasPermissions = results.every((r) => r.granted);

  if (!hasPermissions) {
    console.log("Missing permissions:", results.filter((r) => !r.granted));
    return;
  }

  // ... do something with tabs and history
}
```

### Building a Permission Settings UI

```typescript
import { listPermissions, checkPermissions, requestPermission, removePermission } from "@theluckystrike/webext-permissions";

async function renderPermissionList(container: HTMLElement) {
  // Get all known permissions
  const allPerms = listPermissions();

  // Check which are currently granted
  const permissions = allPerms.map((p) => p.permission);
  const status = await checkPermissions(permissions);

  // Merge and render
  container.innerHTML = status
    .map(
      ({ permission, granted, description }) => `
      <div class="permission-item">
        <input type="checkbox" ${granted ? "checked" : ""} data-perm="${permission}">
        <label>${description}</label>
        <button ${!granted ? "disabled" : ""} data-remove="${permission}">Remove</button>
      </div>
    `
    )
    .join("");

  // Add event listeners
  container.querySelectorAll("input[data-perm]").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const perm = (e.target as HTMLInputElement).dataset.perm!;
      await requestPermission(perm);
    });
  });

  container.querySelectorAll("button[data-remove]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const perm = (e.target as HTMLButtonElement).dataset.remove!;
      await removePermission(perm);
      renderPermissionList(container); // re-render
    });
  });
}
```

### Graceful Error Handling

```typescript
import { requestPermission } from "@theluckystrike/webext-permissions";

document.getElementById("enable-feature")?.addEventListener("click", async () => {
  const result = await requestPermission("notifications");

  if (result.error) {
    // Handle specific errors
    switch (result.error) {
      case "Must be called from a user gesture":
        alert("Please click the button directly, not via keyboard shortcut");
        break;
      case "The extension does not have permission.":
        alert("This permission is not declared in manifest.json");
        break;
      default:
        alert(`Error: ${result.error}`);
    }
  } else if (!result.granted) {
    console.log("User chose not to grant the permission");
  } else {
    console.log("Permission granted! Enabling feature...");
    enableNotifications();
  }
});
```

### Displaying Permission Descriptions in Popup

```typescript
import { getGrantedPermissions, describePermission } from "@theluckystrike/webext-permissions";

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("granted-list")!;
  const granted = await getGrantedPermissions();

  if (granted.length === 0) {
    list.innerHTML = "<p>No additional permissions granted.</p>";
    return;
  }

  list.innerHTML = granted
    .map(
      ({ permission, description }) => `
      <li>
        <code>${permission}</code>
        <span>${description}</span>
      </li>
    `
    )
    .join("");
});
```

### Conditional Feature Loading

```typescript
import { checkPermission } from "@theluckystrike/webext-permissions";

async function initFeature(featureName: "bookmarks" | "history" | "downloads") {
  const hasPermission = await checkPermission(featureName);

  if (!hasPermission.granted) {
    const result = await requestPermission(featureName);
    if (!result.granted) {
      console.log(`Feature ${featureName} requires permission`);
      return null;
    }
  }

  // Load the feature
  return await import(`./features/${featureName}.js`);
}
```

---

## Chrome Extension Guide

Looking for more help building Chrome extensions? Check out these resources:

### Official Documentation

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/) — Official Chrome extension development docs
- [Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/) — Current manifest version
- [Permissions](https://developer.chrome.com/docs/extensions/mv3/permissions/) — Available permissions reference

### Related Packages

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family — typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

### Best Practices

When working with permissions in Chrome extensions:

1. **Request only what's needed** — Only ask for permissions when users need them
2. **Use optional permissions** — Declare in manifest, request at runtime
3. **Handle denials gracefully** — Provide alternative functionality
4. **Explain why you need it** — Show users what the permission enables
5. **Remove when unnecessary** — Revoke permissions users no longer need

---

## Requirements

- Chrome or Chromium-based browser (Chrome, Edge, Brave, etc.)
- Manifest V3 extension
- TypeScript 5.0+ (optional, for TypeScript projects)

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Type check
npm run typecheck
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
