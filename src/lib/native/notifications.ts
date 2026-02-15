/**
 * Push & Local Notification support.
 * Uses Capacitor on native, Web Notifications API on web.
 */

import { isNativePlatform } from "./platform";

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

// ─── Push Notifications (Native Only) ───────────────────────────────────────

let pushToken: string | null = null;

export async function registerPushNotifications(): Promise<string | null> {
  if (!isNativePlatform()) {
    return requestWebNotificationPermission();
  }

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");

    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== "granted") return null;

    await PushNotifications.register();

    return new Promise((resolve) => {
      PushNotifications.addListener("registration", (token) => {
        pushToken = token.value;
        console.log("[Push] Registered with token:", token.value);
        resolve(token.value);
      });

      PushNotifications.addListener("registrationError", (err) => {
        console.error("[Push] Registration error:", err);
        resolve(null);
      });
    });
  } catch {
    return null;
  }
}

export function getPushToken(): string | null {
  return pushToken;
}

export async function addPushReceivedListener(
  callback: (notification: NotificationData) => void
): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      callback({
        title: notification.title || "",
        body: notification.body || "",
        data: notification.data as Record<string, string>,
      });
    });
  } catch {
    // Plugin not available
  }
}

export async function addPushActionListener(
  callback: (notification: NotificationData) => void
): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        callback({
          title: action.notification.title || "",
          body: action.notification.body || "",
          data: action.notification.data as Record<string, string>,
        });
      }
    );
  } catch {
    // Plugin not available
  }
}

// ─── Local Notifications ────────────────────────────────────────────────────

let localNotificationId = 1;

export async function scheduleLocalNotification(
  title: string,
  body: string,
  delaySeconds: number = 0
): Promise<void> {
  if (isNativePlatform()) {
    try {
      const { LocalNotifications } = await import(
        "@capacitor/local-notifications"
      );

      const perms = await LocalNotifications.requestPermissions();
      if (perms.display !== "granted") return;

      const scheduleAt = new Date(Date.now() + delaySeconds * 1000);

      await LocalNotifications.schedule({
        notifications: [
          {
            id: localNotificationId++,
            title,
            body,
            schedule: { at: scheduleAt },
            sound: "notification.wav",
            actionTypeId: "ORDER_UPDATE",
          },
        ],
      });
    } catch {
      // Fallback to web
      showWebNotification(title, body);
    }
  } else {
    if (delaySeconds > 0) {
      setTimeout(() => showWebNotification(title, body), delaySeconds * 1000);
    } else {
      showWebNotification(title, body);
    }
  }
}

export async function scheduleOrderReadyNotification(
  orderId: string,
  pickupTime: string
): Promise<void> {
  await scheduleLocalNotification(
    "Your order is ready!",
    `Order ${orderId.slice(0, 8).toUpperCase()} is ready for pickup at ${pickupTime}.`,
    0
  );
}

export async function schedulePickupReminder(
  orderId: string,
  minutesBefore: number = 30
): Promise<void> {
  await scheduleLocalNotification(
    "Pickup reminder",
    `Don't forget! Your order ${orderId.slice(0, 8).toUpperCase()} is ready for pickup in ${minutesBefore} minutes.`,
    minutesBefore * 60
  );
}

// ─── Web Notification Fallback ──────────────────────────────────────────────

async function requestWebNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) return null;

  const permission = await Notification.requestPermission();
  return permission === "granted" ? "web-notifications-enabled" : null;
}

function showWebNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icons/icon-192.svg",
    badge: "/icons/icon-192.svg",
  });
}
