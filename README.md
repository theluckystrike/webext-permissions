<div align="center">

# @theluckystrike/webext-permissions

Runtime permission checking and requesting for Chrome extensions. Typed helpers for the `chrome.permissions` API.

[![npm version](https://img.shields.io/npm/v/@theluckystrike/webext-permissions)](https://www.npmjs.com/package/@theluckystrike/webext-permissions)
[![npm downloads](https://img.shields.io/npm/dm/@theluckystrike/webext-permissions)](https://www.npmjs.com/package/@theluckystrike/webext-permissions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@theluckystrike/webext-permissions)

[Installation](#installation) · [Quick Start](#quick-start) · [API](#api) · [License](#license)

</div>

---

## Features

- **Check permissions** -- verify if permissions are granted
- **Request permissions** -- prompt the user for optional permissions
- **Remove permissions** -- revoke permissions programmatically
- **Typed** -- full TypeScript support for permission names
- **Promise-based** -- async/await for all operations
- **Event listeners** -- subscribe to permission added/removed events

## Installation

```bash
npm install @theluckystrike/webext-permissions
```

<details>
<summary>Other package managers</summary>

```bash
pnpm add @theluckystrike/webext-permissions
# or
yarn add @theluckystrike/webext-permissions
```

</details>

## Quick Start

```typescript
import { Permissions } from "@theluckystrike/webext-permissions";

const has = await Permissions.contains({ permissions: ["tabs"] });

if (!has) {
  const granted = await Permissions.request({ permissions: ["tabs"] });
}

await Permissions.remove({ permissions: ["tabs"] });
```

## API

| Method | Description |
|--------|-------------|
| `contains(perms)` | Check if permissions are already granted |
| `request(perms)` | Request optional permissions from the user |
| `remove(perms)` | Revoke permissions |
| `getAll()` | List all granted permissions |
| `onAdded(callback)` | Listen for newly granted permissions |
| `onRemoved(callback)` | Listen for revoked permissions |



## Part of @zovo/webext

This package is part of the [@zovo/webext](https://github.com/theluckystrike) family -- typed, modular utilities for Chrome extension development:

| Package | Description |
|---------|-------------|
| [webext-storage](https://github.com/theluckystrike/webext-storage) | Typed storage with schema validation |
| [webext-messaging](https://github.com/theluckystrike/webext-messaging) | Type-safe message passing |
| [webext-tabs](https://github.com/theluckystrike/webext-tabs) | Tab query helpers |
| [webext-cookies](https://github.com/theluckystrike/webext-cookies) | Promise-based cookies API |
| [webext-i18n](https://github.com/theluckystrike/webext-i18n) | Internationalization toolkit |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License -- see [LICENSE](LICENSE) for details.

---

<div align="center">

Built by [theluckystrike](https://github.com/theluckystrike) · [zovo.one](https://zovo.one)

</div>
