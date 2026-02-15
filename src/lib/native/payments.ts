/**
 * Native payment integration using the Web Payment Request API.
 * Works on both native (Apple Pay / Google Pay via Capacitor webview)
 * and modern web browsers.
 */

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface PaymentItem {
  label: string;
  amount: number;
}

function isPaymentRequestSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "PaymentRequest" in window;
}

export function canUseNativePayments(): boolean {
  return isPaymentRequestSupported();
}

export async function checkApplePayAvailable(): Promise<boolean> {
  if (!isPaymentRequestSupported()) return false;

  try {
    const request = new PaymentRequest(
      [{ supportedMethods: "https://apple.com/apple-pay", data: { version: 3, merchantIdentifier: "merchant.com.tucsonchocolatefactory", merchantCapabilities: ["supports3DS"], supportedNetworks: ["visa", "masterCard", "amex", "discover"], countryCode: "US" } }],
      { total: { label: "Test", amount: { currency: "USD", value: "0.01" } } }
    );
    const result = await request.canMakePayment();
    return result;
  } catch {
    return false;
  }
}

export async function checkGooglePayAvailable(): Promise<boolean> {
  if (!isPaymentRequestSupported()) return false;

  try {
    const request = new PaymentRequest(
      [{ supportedMethods: "https://google.com/pay", data: { environment: "PRODUCTION", apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods: [{ type: "CARD", parameters: { allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"] }, tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "shopify", gatewayMerchantId: "tucsonchocolatefactory" } } }] } }],
      { total: { label: "Test", amount: { currency: "USD", value: "0.01" } } }
    );
    const result = await request.canMakePayment();
    return result;
  } catch {
    return false;
  }
}

export async function requestNativePayment(
  items: PaymentItem[],
  total: number
): Promise<PaymentResult> {
  if (!isPaymentRequestSupported()) {
    return { success: false, error: "Native payments not supported on this device" };
  }

  const displayItems: PaymentItem[] = items;

  const methodData: PaymentMethodData[] = [
    {
      supportedMethods: "basic-card",
      data: {
        supportedNetworks: ["visa", "mastercard", "amex", "discover"],
      },
    },
  ];

  // Add Apple Pay if on iOS
  methodData.push({
    supportedMethods: "https://apple.com/apple-pay",
    data: {
      version: 3,
      merchantIdentifier: "merchant.com.tucsonchocolatefactory",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      countryCode: "US",
    },
  });

  // Add Google Pay
  methodData.push({
    supportedMethods: "https://google.com/pay",
    data: {
      environment: "PRODUCTION",
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD", "AMEX", "DISCOVER"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "shopify",
              gatewayMerchantId: "tucsonchocolatefactory",
            },
          },
        },
      ],
    },
  });

  const paymentDetails: PaymentDetailsInit = {
    displayItems: displayItems.map((item) => ({
      label: item.label,
      amount: { currency: "USD", value: item.amount.toFixed(2) },
    })),
    total: {
      label: "Tucson Chocolate Factory",
      amount: { currency: "USD", value: total.toFixed(2) },
    },
  };

  const options: PaymentOptions = {
    requestPayerName: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
  };

  try {
    const request = new PaymentRequest(methodData, paymentDetails, options);
    const canPay = await request.canMakePayment();

    if (!canPay) {
      return { success: false, error: "No payment methods available" };
    }

    const response = await request.show();
    await response.complete("success");

    return {
      success: true,
      transactionId: response.requestId,
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, error: "Payment cancelled" };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Payment failed",
    };
  }
}
