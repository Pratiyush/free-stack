/**
 * safeStorage — localStorage wrapper that swallows browser errors.
 *
 * Why: Safari private mode raises `SecurityError` on every localStorage call.
 * Quota-exceeded (~5MB) throws `QuotaExceededError` (or DOMException 22). SSR
 * has no `localStorage` at all. Callers shouldn't have to wrap every access.
 *
 * Strategy: in-memory fallback Map. If real storage works, writes go to both.
 * If it doesn't, we silently degrade to per-session memory — preferences
 * survive a soft nav but not a hard reload, which is the right failure mode.
 *
 * Used by ThemeToggle, view-mode persistence, and any client-side preference.
 * Hand-rolled because the dep landscape (idb-keyval, store2, etc.) is bigger
 * than this 40-line file.
 */

const memoryFallback = new Map<string, string>();

function hasLocalStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const probe = '__opentier_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const available = hasLocalStorage();

export const safeStorage = {
  get(key: string): string | null {
    if (available) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // fall through to memory
      }
    }
    return memoryFallback.get(key) ?? null;
  },

  set(key: string, value: string): void {
    memoryFallback.set(key, value);
    if (available) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // memory write already happened; nothing else to do
      }
    }
  },

  remove(key: string): void {
    memoryFallback.delete(key);
    if (available) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
  },
};
