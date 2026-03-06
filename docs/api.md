---
layout: default
title: API Reference
---

# API Reference


checkPermission(permission)

Checks whether a single permission is currently granted.

    const result = await checkPermission("tabs");
    // { permission: "tabs", granted: true, description: "Read information about open tabs" }

Returns a Promise resolving to a PermissionResult.


checkPermissions(permissions)

Checks multiple permissions at once. Returns results in the same order as the input array.

    const results = await checkPermissions(["tabs", "storage", "cookies"]);


requestPermission(permission)

Requests a single optional permission from the user. Must be called from a user gesture (click handler, keyboard shortcut, etc).

    const result = await requestPermission("bookmarks");
    if (result.granted) {
      // permission is now available
    }

Returns a RequestResult. If the request fails, the error field contains the reason.


requestPermissions(permissions)

Requests multiple permissions in a single browser prompt.

    const result = await requestPermissions(["tabs", "bookmarks"]);


removePermission(permission)

Removes a previously granted optional permission.

    const removed = await removePermission("tabs");
    // true if successful


getGrantedPermissions()

Returns all permissions currently granted to the extension, with human-readable descriptions.

    const granted = await getGrantedPermissions();
    for (const p of granted) {
      console.log(p.permission, p.description);
    }


describePermission(permission)

Synchronous. Returns a human-readable description for any Chrome permission string.

    describePermission("activeTab");
    // "Access the currently active tab when you click the extension"

Unknown permissions get a generic fallback description.


listPermissions()

Returns all 54 known Chrome permissions with descriptions. The granted field is always false in this static listing. Use checkPermissions for live data.


Types

    PermissionResult    { permission: string; granted: boolean; description: string }
    RequestResult       { granted: boolean; error?: string }


Back to [home](./).
