---
layout: default
title: webext-permissions
---

# @theluckystrike/webext-permissions

Runtime permission management for Chrome extensions. Check, request, and remove optional permissions with full TypeScript support and human-readable descriptions.

[View on GitHub](https://github.com/theluckystrike/webext-permissions)


GETTING STARTED

Install the package.

    npm install @theluckystrike/webext-permissions

Import the functions you need.

    import {
      checkPermission,
      requestPermission,
      getGrantedPermissions,
    } from "@theluckystrike/webext-permissions";

Check whether a permission is granted.

    const result = await checkPermission("storage");
    console.log(result.granted, result.description);

Request a permission from the user. This must happen inside a click handler or other user gesture.

    document.getElementById("btn").addEventListener("click", async () => {
      const req = await requestPermission("tabs");
      if (req.granted) {
        // tabs API is now available
      }
    });


API REFERENCE

See the full [API docs](./api).


ABOUT

Part of the @zovo/webext toolkit by theluckystrike. Learn more at zovo.one.
