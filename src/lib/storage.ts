/**
 * Persistent storage for orders, user profile, and loyalty data.
 * Uses localStorage with JSON serialization.
 */

// ─── Order History ──────────────────────────────────────────────────────────

export interface StoredOrder {
  id: string;
  items: {
    variantId: string;
    productId: string;
    name: string;
    variantTitle: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  pickupMethod: "in-store" | "curbside";
  pickupDate: string;
  pickupTime: string;
  customerName: string;
  email: string;
  phone: string;
  notes?: string;
  status: "pending" | "preparing" | "ready" | "picked_up";
  createdAt: string;
}

const ORDER_HISTORY_KEY = "tcf_order_history";
const USER_PROFILE_KEY = "tcf_user_profile";
const LOYALTY_KEY = "tcf_loyalty";
const CART_KEY = "tcf_cart";
const NOTIFICATION_PREFS_KEY = "tcf_notification_prefs";

export function getOrderHistory(): StoredOrder[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const data = localStorage.getItem(ORDER_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: StoredOrder): void {
  const orders = getOrderHistory();
  orders.unshift(order); // Most recent first
  // Keep last 50 orders
  if (orders.length > 50) orders.length = 50;
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): StoredOrder | null {
  const orders = getOrderHistory();
  return orders.find((o) => o.id === id) || null;
}

export function updateOrderStatus(
  id: string,
  status: StoredOrder["status"]
): void {
  const orders = getOrderHistory();
  const order = orders.find((o) => o.id === id);
  if (order) {
    order.status = status;
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
  }
}

// ─── User Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday?: string; // MM-DD format
  anniversary?: string; // first purchase date
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
}

export function getUserProfile(): UserProfile | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const data = localStorage.getItem(USER_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

// ─── Loyalty Program ────────────────────────────────────────────────────────

export interface LoyaltyData {
  points: number;
  totalOrders: number;
  tier: "bronze" | "silver" | "gold" | "chocolate";
  scannedCodes: string[];
  lastScannedAt?: string;
}

export function getLoyaltyData(): LoyaltyData {
  if (typeof localStorage === "undefined") {
    return { points: 0, totalOrders: 0, tier: "bronze", scannedCodes: [] };
  }
  try {
    const data = localStorage.getItem(LOYALTY_KEY);
    return data
      ? JSON.parse(data)
      : { points: 0, totalOrders: 0, tier: "bronze", scannedCodes: [] };
  } catch {
    return { points: 0, totalOrders: 0, tier: "bronze", scannedCodes: [] };
  }
}

export function addLoyaltyPoints(points: number): LoyaltyData {
  const data = getLoyaltyData();
  data.points += points;
  data.totalOrders += 1;

  // Update tier based on total points
  if (data.points >= 1000) data.tier = "chocolate";
  else if (data.points >= 500) data.tier = "gold";
  else if (data.points >= 200) data.tier = "silver";
  else data.tier = "bronze";

  localStorage.setItem(LOYALTY_KEY, JSON.stringify(data));
  return data;
}

export function redeemLoyaltyCode(code: string): {
  success: boolean;
  points: number;
  message: string;
} {
  const data = getLoyaltyData();

  if (data.scannedCodes.includes(code)) {
    return { success: false, points: 0, message: "This code has already been redeemed." };
  }

  // Award points based on code prefix
  let points = 10; // Default points
  if (code.startsWith("TCF50")) points = 50;
  else if (code.startsWith("TCF25")) points = 25;
  else if (code.startsWith("TCF100")) points = 100;

  data.scannedCodes.push(code);
  data.points += points;
  data.lastScannedAt = new Date().toISOString();

  // Update tier
  if (data.points >= 1000) data.tier = "chocolate";
  else if (data.points >= 500) data.tier = "gold";
  else if (data.points >= 200) data.tier = "silver";
  else data.tier = "bronze";

  localStorage.setItem(LOYALTY_KEY, JSON.stringify(data));

  return {
    success: true,
    points,
    message: `You earned ${points} points! Total: ${data.points}`,
  };
}

// ─── Cart Persistence ───────────────────────────────────────────────────────

export function getPersistedCart(): StoredOrder["items"] {
  if (typeof localStorage === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function persistCart(items: StoredOrder["items"]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearPersistedCart(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

// ─── Notification Preferences ───────────────────────────────────────────────

export interface NotificationPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  arrivalAlerts: boolean;
}

export function getNotificationPrefs(): NotificationPrefs {
  if (typeof localStorage === "undefined") {
    return { orderUpdates: true, promotions: false, arrivalAlerts: true };
  }
  try {
    const data = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    return data
      ? JSON.parse(data)
      : { orderUpdates: true, promotions: false, arrivalAlerts: true };
  } catch {
    return { orderUpdates: true, promotions: false, arrivalAlerts: true };
  }
}

export function saveNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
}
