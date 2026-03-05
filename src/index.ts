/** Human-readable descriptions for Chrome permission strings. */
export const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  activeTab: "Access the currently active tab when you click the extension",
  alarms: "Schedule code to run at specific times",
  background: "Run background processes",
  bookmarks: "Read and modify bookmarks",
  browsingData: "Clear browsing data",
  clipboardRead: "Read data from the clipboard",
  clipboardWrite: "Write data to the clipboard",
  contentSettings: "Change browser content settings",
  contextMenus: "Add items to the right-click context menu",
  cookies: "Read and modify cookies",
  debugger: "Access the Chrome debugger protocol",
  declarativeContent: "Take actions based on page content",
  declarativeNetRequest: "Block or modify network requests",
  declarativeNetRequestFeedback: "Get feedback on declarative net requests",
  desktopCapture: "Capture screen, window, or tab content",
  downloads: "Manage downloads",
  favicon: "Access website favicons",
  fontSettings: "Manage font settings",
  gcm: "Use Google Cloud Messaging",
  geolocation: "Access your geographic location",
  history: "Read and modify browsing history",
  identity: "Sign in with your Google account",
  idle: "Detect when the system is idle",
  management: "Manage other extensions and apps",
  nativeMessaging: "Communicate with native applications",
  notifications: "Show desktop notifications",
  offscreen: "Create offscreen documents",
  pageCapture: "Save pages as MHTML",
  power: "Prevent the system from sleeping",
  privacy: "Control privacy-related settings",
  proxy: "Manage proxy settings",
  readingList: "Access the reading list",
  scripting: "Inject scripts into web pages",
  search: "Use the default search provider",
  sessions: "Access recently closed tabs and devices",
  sidePanel: "Display content in the side panel",
  storage: "Store and retrieve data locally",
  system_cpu: "Read CPU usage information",
  system_display: "Read display information",
  system_memory: "Read memory usage information",
  system_storage: "Read storage device information",
  tabCapture: "Capture tab content",
  tabGroups: "Manage tab groups",
  tabs: "Read information about open tabs",
  topSites: "Access most visited sites",
  tts: "Use text-to-speech",
  ttsEngine: "Implement a text-to-speech engine",
  unlimitedStorage: "Store unlimited data locally",
  vpnProvider: "Implement a VPN client",
  wallpaper: "Change the ChromeOS wallpaper",
  webNavigation: "Track navigation events",
  webRequest: "Observe and modify network requests",
};

export interface PermissionResult {
  permission: string;
  granted: boolean;
  description: string;
}

export interface RequestResult {
  granted: boolean;
  error?: string;
}

/**
 * Get the human-readable description for a permission.
 * Returns a fallback string for unknown permissions.
 */
export function describePermission(permission: string): string {
  return PERMISSION_DESCRIPTIONS[permission] ?? `Use the "${permission}" API`;
}

/**
 * List all known permissions with their human-readable descriptions.
 */
export function listPermissions(): PermissionResult[] {
  return Object.entries(PERMISSION_DESCRIPTIONS).map(
    ([permission, description]) => ({
      permission,
      granted: false,
      description,
    }),
  );
}

/**
 * Check if a single permission is currently granted.
 */
export async function checkPermission(
  permission: string,
): Promise<PermissionResult> {
  const granted = await new Promise<boolean>((resolve) =>
    chrome.permissions.contains({ permissions: [permission] }, resolve),
  );
  return { permission, granted, description: describePermission(permission) };
}

/**
 * Batch-check multiple permissions at once.
 * Returns an array of results in the same order as the input.
 */
export async function checkPermissions(
  permissions: string[],
): Promise<PermissionResult[]> {
  return Promise.all(permissions.map(checkPermission));
}

/**
 * Request a single permission with user-friendly error handling.
 * The request must be triggered by a user gesture (e.g., button click).
 */
export async function requestPermission(
  permission: string,
): Promise<RequestResult> {
  try {
    const granted = await new Promise<boolean>((resolve, reject) =>
      chrome.permissions.request({ permissions: [permission] }, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result);
        }
      }),
    );
    return { granted };
  } catch (err) {
    return {
      granted: false,
      error:
        err instanceof Error ? err.message : `Failed to request "${permission}"`,
    };
  }
}

/**
 * Request multiple permissions in a single prompt.
 */
export async function requestPermissions(
  permissions: string[],
): Promise<RequestResult> {
  try {
    const granted = await new Promise<boolean>((resolve, reject) =>
      chrome.permissions.request({ permissions }, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result);
        }
      }),
    );
    return { granted };
  } catch (err) {
    return {
      granted: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to request permissions",
    };
  }
}

/**
 * Remove a granted permission.
 */
export async function removePermission(
  permission: string,
): Promise<boolean> {
  return new Promise<boolean>((resolve) =>
    chrome.permissions.remove({ permissions: [permission] }, resolve),
  );
}

/**
 * Get all currently granted permissions with descriptions.
 */
export async function getGrantedPermissions(): Promise<PermissionResult[]> {
  const perms = await new Promise<chrome.permissions.Permissions>((resolve) =>
    chrome.permissions.getAll(resolve),
  );
  return (perms.permissions ?? []).map((permission) => ({
    permission,
    granted: true,
    description: describePermission(permission),
  }));
}
