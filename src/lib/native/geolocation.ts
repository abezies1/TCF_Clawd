/**
 * Location services & geofencing for curbside pickup.
 * Uses Capacitor Geolocation on native, Web Geolocation API on web.
 */

import { isNativePlatform } from "./platform";
import { scheduleLocalNotification } from "./notifications";

// Tucson Chocolate Factory store location
const STORE_LOCATION = {
  latitude: 32.2226,
  longitude: -110.9747,
  name: "Tucson Chocolate Factory",
};

// Geofence radius in meters
const GEOFENCE_RADIUS_METERS = 200;
const ARRIVAL_RADIUS_METERS = 50;

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export async function getCurrentPosition(): Promise<Coordinates | null> {
  if (isNativePlatform()) {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        return null;
      }
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch {
      return null;
    }
  }

  // Web fallback
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Calculate distance between two points using the Haversine formula.
 * Returns distance in meters.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDistanceToStore(coords: Coordinates): number {
  return calculateDistance(
    coords.latitude,
    coords.longitude,
    STORE_LOCATION.latitude,
    STORE_LOCATION.longitude
  );
}

export function isWithinGeofence(coords: Coordinates): boolean {
  return getDistanceToStore(coords) <= GEOFENCE_RADIUS_METERS;
}

export function hasArrived(coords: Coordinates): boolean {
  return getDistanceToStore(coords) <= ARRIVAL_RADIUS_METERS;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const miles = meters / 1609.344;
  return `${miles.toFixed(1)} mi`;
}

// ─── Geofence Monitoring ────────────────────────────────────────────────────

let watchId: number | null = null;
let geofenceCallback: ((entered: boolean, coords: Coordinates) => void) | null = null;
let wasInGeofence = false;

export async function startGeofenceMonitoring(
  onGeofenceEvent: (entered: boolean, coords: Coordinates) => void
): Promise<boolean> {
  geofenceCallback = onGeofenceEvent;

  if (isNativePlatform()) {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
        return false;
      }

      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (position, err) => {
          if (err || !position) return;
          handlePositionUpdate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        }
      );
      watchId = parseInt(id, 10);
      return true;
    } catch {
      return false;
    }
  }

  // Web fallback
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    return false;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      handlePositionUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    () => {},
    { enableHighAccuracy: true }
  );

  return true;
}

function handlePositionUpdate(coords: Coordinates): void {
  const inGeofence = isWithinGeofence(coords);

  if (inGeofence && !wasInGeofence) {
    // Entered geofence
    wasInGeofence = true;
    geofenceCallback?.(true, coords);

    if (hasArrived(coords)) {
      scheduleLocalNotification(
        "You've arrived!",
        "We'll start preparing your order. Please park in a curbside spot."
      );
    } else {
      scheduleLocalNotification(
        "Almost there!",
        `You're within ${formatDistance(getDistanceToStore(coords))} of the shop. We're getting your order ready!`
      );
    }
  } else if (!inGeofence && wasInGeofence) {
    // Left geofence
    wasInGeofence = false;
    geofenceCallback?.(false, coords);
  }
}

export async function stopGeofenceMonitoring(): Promise<void> {
  if (watchId === null) return;

  if (isNativePlatform()) {
    try {
      const { Geolocation } = await import("@capacitor/geolocation");
      await Geolocation.clearWatch({ id: String(watchId) });
    } catch {
      // Plugin not available
    }
  } else if (typeof navigator !== "undefined" && "geolocation" in navigator) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = null;
  geofenceCallback = null;
  wasInGeofence = false;
}

export function getDirectionsUrl(): string {
  return `https://maps.apple.com/?daddr=${STORE_LOCATION.latitude},${STORE_LOCATION.longitude}&dirflg=d`;
}

export function getGoogleMapsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${STORE_LOCATION.latitude},${STORE_LOCATION.longitude}`;
}

export function getStoreLocation() {
  return STORE_LOCATION;
}
