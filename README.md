# @theluckystrike/webext-permissions

Runtime permission management for Chrome extensions. Check, request, and remove optional permissions with a clean async API. Includes human-readable descriptions for all 54 Chrome permission strings.


INSTALL

npm install @theluckystrike/webext-permissions


QUICK START

import {
  checkPermission,
  requestPermission,
  getGrantedPermissions,
  describePermission,
} from "@theluckystrike/webext-permissions";

// Check if a permission is granted
const result = await checkPermission("storage");
console.log(result.granted, result.description);

// Request a permission (must be called from a user gesture)
const req = await requestPermission("tabs");
if (req.granted) {
  console.log("tabs permission granted");
}

// Get all currently granted permissions
const granted = await getGrantedPermissions();

// Get a human-readable description
describePermission("activeTab");
// "Access the currently active tab when you click the extension"


API

checkPermission(permission)

Checks whether a single permission is currently granted. Returns a Promise resolving to a PermissionResult with permission name, granted status, and a human-readable description.


checkPermissions(permissions)

Batch version. Takes an array of permission strings and returns a Promise resolving to an array of PermissionResult objects in the same order.


requestPermission(permission)

Requests a single optional permission. This must be called from a user gesture like a button click. Returns a Promise resolving to a RequestResult with a granted boolean and an optional error string.


requestPermissions(permissions)

Requests multiple permissions in a single browser prompt. Same user gesture requirement applies.


removePermission(permission)

Removes a previously granted permission. Returns a Promise resolving to true if the removal succeeded.


getGrantedPermissions()

Returns all currently granted permissions as an array of PermissionResult objects, each with a human-readable description.


describePermission(permission)

Synchronous function that returns a human-readable description for any Chrome permission string. For unknown permissions, returns a fallback string.


listPermissions()

Returns all 54 known Chrome permissions with their descriptions. The granted field is always false in this listing. Use checkPermissions for live status.


TYPES

  PermissionResult    { permission: string; granted: boolean; description: string }
  RequestResult       { granted: boolean; error?: string }


PERMISSION DESCRIPTIONS

The library ships with plain-English descriptions for all standard Chrome permissions. A few examples:

  activeTab           Access the currently active tab when you click the extension
  storage             Store and retrieve data locally
  tabs                Read information about open tabs
  notifications       Show desktop notifications
  cookies             Read and modify cookies
  scripting           Inject scripts into web pages
  webNavigation       Track navigation events
  bookmarks           Read and modify bookmarks
  history             Read and modify browsing history
  downloads           Manage downloads

There are 54 descriptions in total. See the source for the full list.


MANIFEST SETUP

Permissions you want to request at runtime must be listed under optional_permissions in your manifest.json.

{
  "optional_permissions": ["tabs", "bookmarks", "history"]
}

Required permissions listed under permissions are always granted and cannot be managed at runtime.


LICENSE

MIT


ABOUT

Part of the @zovo/webext toolkit. Built by theluckystrike at zovo.one, a studio for Chrome extensions and browser tools.

https://github.com/theluckystrike/webext-permissions


Part of the **[Chrome Extension Toolkit](https://github.com/theluckystrike/chrome-extension-toolkit)** by theluckystrike. See all templates, packages, and guides at [github.com/theluckystrike/chrome-extension-toolkit](https://github.com/theluckystrike/chrome-extension-toolkit).
