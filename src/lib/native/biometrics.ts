/**
 * Biometric authentication (Face ID / Touch ID / Fingerprint).
 * Uses Web Credential Management API with platform authenticator
 * for cross-platform biometric support.
 */

export interface BiometricResult {
  success: boolean;
  error?: string;
}

export function isBiometricsSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "PublicKeyCredential" in window &&
    typeof PublicKeyCredential !== "undefined"
  );
}

export async function checkBiometricAvailability(): Promise<boolean> {
  if (!isBiometricsSupported()) return false;

  try {
    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}

/**
 * Register biometric credentials for the user.
 * This stores a credential tied to the device's biometric sensor.
 */
export async function registerBiometric(
  userId: string,
  userName: string
): Promise<BiometricResult> {
  if (!isBiometricsSupported()) {
    return { success: false, error: "Biometrics not supported" };
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: {
          name: "Tucson Chocolate Factory",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      },
    });

    if (credential) {
      // Store credential ID for future authentication
      const credentialId = (credential as PublicKeyCredential).rawId;
      const credIdBase64 = btoa(
        String.fromCharCode(...new Uint8Array(credentialId))
      );
      localStorage.setItem("tcf_biometric_cred_id", credIdBase64);
      localStorage.setItem("tcf_biometric_user_id", userId);
      localStorage.setItem("tcf_biometric_user_name", userName);
      return { success: true };
    }

    return { success: false, error: "Failed to create credential" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Biometric registration failed",
    };
  }
}

/**
 * Authenticate using biometrics (Face ID / Touch ID).
 */
export async function authenticateWithBiometric(): Promise<BiometricResult> {
  if (!isBiometricsSupported()) {
    return { success: false, error: "Biometrics not supported" };
  }

  const credIdBase64 = localStorage.getItem("tcf_biometric_cred_id");
  if (!credIdBase64) {
    return { success: false, error: "No biometric credentials registered" };
  }

  try {
    const credentialId = Uint8Array.from(atob(credIdBase64), (c) =>
      c.charCodeAt(0)
    );
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [
          {
            type: "public-key",
            id: credentialId,
          },
        ],
        userVerification: "required",
        timeout: 60000,
      },
    });

    if (assertion) {
      return { success: true };
    }

    return { success: false, error: "Authentication failed" };
  } catch (err) {
    if (err instanceof Error && err.name === "NotAllowedError") {
      return { success: false, error: "Authentication cancelled" };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Biometric authentication failed",
    };
  }
}

export function hasBiometricCredentials(): boolean {
  if (typeof localStorage === "undefined") return false;
  return !!localStorage.getItem("tcf_biometric_cred_id");
}

export function getBiometricUserName(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("tcf_biometric_user_name");
}

export function clearBiometricCredentials(): void {
  localStorage.removeItem("tcf_biometric_cred_id");
  localStorage.removeItem("tcf_biometric_user_id");
  localStorage.removeItem("tcf_biometric_user_name");
}
