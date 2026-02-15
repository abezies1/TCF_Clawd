/**
 * Home screen widget configuration for iOS and Android.
 *
 * iOS: Uses WidgetKit via Capacitor plugin or native Swift extension.
 * Android: Uses App Widgets via Capacitor plugin or native Kotlin.
 *
 * This module provides the data that widgets display and
 * the configuration for setting them up via native code.
 */

import { getOrderHistory } from "@/lib/storage";

export interface WidgetData {
  storeOpen: boolean;
  storeHours: string;
  nextHoliday: string | null;
  featuredProduct: string | null;
  activeOrder: {
    id: string;
    status: string;
    pickupTime: string;
  } | null;
}

// Store hours configuration
const STORE_HOURS = {
  0: null, // Sunday - closed
  1: { open: "10:00", close: "17:00" },
  2: { open: "10:00", close: "17:00" },
  3: { open: "10:00", close: "17:00" },
  4: { open: "10:00", close: "17:00" },
  5: { open: "10:00", close: "17:00" },
  6: { open: "10:00", close: "17:00" },
} as const;

const HOLIDAYS = [
  { date: "01-01", name: "New Year's Day" },
  { date: "07-04", name: "Independence Day" },
  { date: "11-28", name: "Thanksgiving" },
  { date: "12-25", name: "Christmas Day" },
];

export function isStoreOpen(): boolean {
  const now = new Date();
  const day = now.getDay() as keyof typeof STORE_HOURS;
  const hours = STORE_HOURS[day];
  if (!hours) return false;

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return currentTime >= hours.open && currentTime < hours.close;
}

export function getStoreHoursDisplay(): string {
  const now = new Date();
  const day = now.getDay() as keyof typeof STORE_HOURS;
  const hours = STORE_HOURS[day];

  if (!hours) return "Closed today (Sunday)";

  if (isStoreOpen()) {
    return `Open now until 5:00 PM`;
  }

  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (currentTime < hours.open) {
    return `Opens at 10:00 AM`;
  }

  return `Closed - Opens Mon 10:00 AM`;
}

export function getNextHoliday(): string | null {
  const now = new Date();
  const currentMonthDay = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  for (const holiday of HOLIDAYS) {
    if (holiday.date >= currentMonthDay) {
      return `Closed on ${holiday.name}`;
    }
  }

  return null;
}

export function getWidgetData(): WidgetData {
  const orders = getOrderHistory();
  const activeOrder = orders.find(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  );

  return {
    storeOpen: isStoreOpen(),
    storeHours: getStoreHoursDisplay(),
    nextHoliday: getNextHoliday(),
    featuredProduct: "Prickly Pear Truffles",
    activeOrder: activeOrder
      ? {
          id: activeOrder.id.slice(0, 8).toUpperCase(),
          status: activeOrder.status,
          pickupTime: activeOrder.pickupTime,
        }
      : null,
  };
}

/**
 * iOS WidgetKit configuration (to be implemented in the native Swift extension).
 *
 * Widget types for Tucson Chocolate Factory:
 *
 * 1. TCFStoreStatusWidget (Small)
 *    - Shows: Store open/closed, hours
 *    - Tap: Opens app to menu
 *
 * 2. TCFOrderTrackerWidget (Medium)
 *    - Shows: Active order status, pickup time
 *    - Tap: Opens app to order details
 *
 * 3. TCFFeaturedWidget (Large)
 *    - Shows: Featured product of the day, store hours, active order
 *    - Tap: Opens app to featured product or order
 *
 * Timeline:
 *    - Refresh every 15 minutes (WidgetKit minimum)
 *    - Force refresh on order status change via WidgetCenter.shared.reloadAllTimelines()
 */
export const WIDGET_CONFIGURATIONS = {
  storeStatus: {
    kind: "TCFStoreStatus",
    displayName: "Store Status",
    description: "Shows if the store is open and current hours",
    supportedFamilies: ["systemSmall"],
  },
  orderTracker: {
    kind: "TCFOrderTracker",
    displayName: "Order Tracker",
    description: "Track your active order status",
    supportedFamilies: ["systemSmall", "systemMedium"],
  },
  featured: {
    kind: "TCFFeatured",
    displayName: "TCF Featured",
    description: "Featured chocolates and store info",
    supportedFamilies: ["systemMedium", "systemLarge"],
  },
} as const;

/**
 * Android Widget configuration (to be implemented in native Kotlin).
 *
 * Widget types:
 *
 * 1. TCFStoreStatusWidget (1x1)
 *    - Shows: Store open/closed status
 *
 * 2. TCFOrderWidget (2x1)
 *    - Shows: Active order details
 *
 * 3. TCFQuickOrderWidget (2x2)
 *    - Shows: Quick reorder button + store status
 */
export const ANDROID_WIDGET_CONFIGURATIONS = {
  storeStatus: {
    className: "TCFStoreStatusWidget",
    minWidth: 40,
    minHeight: 40,
    updatePeriodMillis: 900000, // 15 minutes
    resizeMode: "none",
  },
  orderTracker: {
    className: "TCFOrderWidget",
    minWidth: 110,
    minHeight: 40,
    updatePeriodMillis: 300000, // 5 minutes
    resizeMode: "horizontal",
  },
  quickOrder: {
    className: "TCFQuickOrderWidget",
    minWidth: 110,
    minHeight: 110,
    updatePeriodMillis: 900000,
    resizeMode: "horizontal|vertical",
  },
} as const;
