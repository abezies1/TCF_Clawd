/**
 * Platform detection utilities for Capacitor native vs web.
 */

export function isNativePlatform(): boolean {
  if (typeof window === "undefined") return false;
  // Capacitor sets this on the window object when running natively
  return !!(window as Record<string, unknown>).Capacitor;
}

export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (window as Record<string, unknown>).Capacitor as
    | { getPlatform?: () => string }
    | undefined;
  if (cap?.getPlatform) {
    const p = cap.getPlatform();
    if (p === "ios") return "ios";
    if (p === "android") return "android";
  }
  return "web";
}

export function isIOS(): boolean {
  return getPlatform() === "ios";
}

export function isAndroid(): boolean {
  return getPlatform() === "android";
}
