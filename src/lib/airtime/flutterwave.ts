import type {
  AirtimeSupplier,
  PurchaseParams,
  PurchaseResult,
  StatusResult,
} from "./types";

/**
 * Flutterwave Bills API implementation for multi-country African airtime.
 * Docs: https://developer.flutterwave.com/reference/endpoints/bills/
 */
export class FlutterwaveSupplier implements AirtimeSupplier {
  private readonly baseUrl = "https://api.flutterwave.com/v3";
  private readonly secretKey: string;

  constructor() {
    this.secretKey = process.env.FLW_SECRET_KEY || "";
  }

  /**
   * Dispatches airtime across African networks via Flutterwave Bills API
   */
  async purchase(params: PurchaseParams): Promise<PurchaseResult> {
    const reference = `FLW-BB-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const country = (params.countryCode || "NG").toUpperCase();

    // Sanitize phone number: strip non-numeric characters
    const cleanPhone = params.phoneNumber.replace(/\D/g, "");

    // If no secret key is set yet or using placeholder, run in simulated test mode
    if (!this.secretKey || this.secretKey.includes("your-secret-key")) {
      console.log("[Flutterwave] Simulated Test Mode (no live key provided):", {
        country,
        network: params.network,
        phone: cleanPhone,
        amount: params.amountNgn,
        reference,
      });

      return {
        success: true,
        reference,
        message: "Simulated test fulfillment (add FLW_SECRET_KEY in .env.local to use real test API)",
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/bills`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country,
          customer: cleanPhone,
          amount: params.amountNgn,
          recurrence: "ONCE",
          type: "AIRTIME",
          reference,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        console.error("[Flutterwave] Airtime purchase error:", data);
        return {
          success: false,
          reference,
          message: data.message || "Failed to process airtime with Flutterwave",
          data,
        };
      }

      const flwRef = data.data?.flw_ref || data.data?.tx_ref || reference;

      return {
        success: true,
        reference: flwRef,
        message: data.message || "Airtime purchase successful",
        data: data.data,
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("[Flutterwave] Network request failed:", errMsg);
      return {
        success: false,
        reference,
        message: errMsg,
      };
    }
  }

  /**
   * Check status of an airtime bill payment
   */
  async checkStatus(reference: string): Promise<StatusResult> {
    if (!this.secretKey || this.secretKey.includes("your-secret-key")) {
      return {
        status: "delivered",
        message: `Simulated order ${reference} completed`,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/bills/${encodeURIComponent(reference)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success" && data.data?.status === "successful") {
        return { status: "delivered", message: "Transaction successful" };
      } else if (data.data?.status === "failed") {
        return { status: "failed", message: data.message || "Transaction failed" };
      }

      return { status: "pending", message: "Transaction is being processed" };
    } catch {
      return { status: "pending", message: "Status verification in progress" };
    }
  }
}

export const flutterwaveSupplier = new FlutterwaveSupplier();

