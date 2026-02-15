/**
 * Camera integration for QR code scanning (loyalty program).
 * Uses Capacitor Camera on native, falls back to file input on web.
 */

import { isNativePlatform } from "./platform";

export interface ScanResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Open the camera to scan a QR code.
 * On native: uses Capacitor Camera plugin.
 * On web: opens a video stream and scans using BarcodeDetector API.
 */
export async function scanQRCode(): Promise<ScanResult> {
  // Try native BarcodeDetector API first (available on Android Chrome, some iOS)
  if ("BarcodeDetector" in window) {
    return scanWithBarcodeDetector();
  }

  if (isNativePlatform()) {
    return scanWithCapacitorCamera();
  }

  // Fallback: manual entry
  return { success: false, error: "QR scanning not supported on this device" };
}

async function scanWithBarcodeDetector(): Promise<ScanResult> {
  try {
    const BarcodeDetector = (window as Record<string, unknown>)
      .BarcodeDetector as new (options: { formats: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<{ rawValue: string }[]>;
    };
    const detector = new BarcodeDetector({ formats: ["qr_code"] });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });

    const video = document.createElement("video");
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    await video.play();

    // Scan frames until QR code found or timeout
    const startTime = Date.now();
    const timeout = 15000; // 15 second timeout

    const result = await new Promise<ScanResult>((resolve) => {
      const scanFrame = async () => {
        if (Date.now() - startTime > timeout) {
          resolve({ success: false, error: "Scan timed out" });
          return;
        }

        try {
          const barcodes = await detector.detect(video);
          if (barcodes.length > 0) {
            resolve({ success: true, data: barcodes[0].rawValue });
            return;
          }
        } catch {
          // Continue scanning
        }

        requestAnimationFrame(scanFrame);
      };

      scanFrame();
    });

    // Clean up
    stream.getTracks().forEach((track) => track.stop());
    video.remove();

    return result;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Camera access denied",
    };
  }
}

async function scanWithCapacitorCamera(): Promise<ScanResult> {
  try {
    const { Camera, CameraResultType } = await import("@capacitor/camera");

    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    if (photo.dataUrl) {
      // On native, we'd process the image for QR codes
      // For now, return the photo data for server-side processing
      return {
        success: true,
        data: photo.dataUrl,
      };
    }

    return { success: false, error: "No photo captured" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Camera error",
    };
  }
}

export function isCameraSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
