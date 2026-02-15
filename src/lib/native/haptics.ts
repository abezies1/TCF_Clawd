/**
 * Haptic feedback wrapper.
 * Uses Capacitor Haptics on native, falls back to vibration API on web.
 */

import { isNativePlatform } from "./platform";

type ImpactStyle = "HEAVY" | "MEDIUM" | "LIGHT";

export async function impactFeedback(style: ImpactStyle = "MEDIUM"): Promise<void> {
  if (isNativePlatform()) {
    try {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      const styleMap: Record<string, typeof ImpactStyle[keyof typeof ImpactStyle]> = {
        HEAVY: ImpactStyle.Heavy,
        MEDIUM: ImpactStyle.Medium,
        LIGHT: ImpactStyle.Light,
      };
      await Haptics.impact({ style: styleMap[style] });
    } catch {
      // Plugin not available
    }
  } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    const duration = style === "HEAVY" ? 50 : style === "MEDIUM" ? 30 : 15;
    navigator.vibrate(duration);
  }
}

export async function notificationFeedback(): Promise<void> {
  if (isNativePlatform()) {
    try {
      const { Haptics, NotificationType } = await import("@capacitor/haptics");
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Plugin not available
    }
  } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([30, 50, 30]);
  }
}

export async function selectionFeedback(): Promise<void> {
  if (isNativePlatform()) {
    try {
      const { Haptics } = await import("@capacitor/haptics");
      await Haptics.selectionStart();
      await Haptics.selectionChanged();
      await Haptics.selectionEnd();
    } catch {
      // Plugin not available
    }
  } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}
