import type {
  AirtimeSupplier,
  Network,
  PurchaseParams,
  PurchaseResult,
  StatusResult,
} from "./types";

// VTpass network service IDs
const VTPASS_SERVICE_IDS: Record<Network, string> = {
  mtn: "mtn",
  airtel: "airtel",
  glo: "glo",
  "9mobile": "etisalat",
};

export class VTpassSupplier implements AirtimeSupplier {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly publicKey: string;
  private readonly secretKey: string;

  constructor() {
    this.baseUrl = process.env.VTPASS_BASE_URL ?? "https://sandbox.vtpass.com/api";
    this.apiKey = process.env.VTPASS_API_KEY ?? "";
    this.publicKey = process.env.VTPASS_PUBLIC_KEY ?? "";
    this.secretKey = process.env.VTPASS_SECRET_KEY ?? "";
  }

  private get authHeader() {
    const creds = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString("base64");
    return `Basic ${creds}`;
  }

  private generateRequestId(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  async purchase(params: PurchaseParams): Promise<PurchaseResult> {
    const serviceID = VTPASS_SERVICE_IDS[params.network];
    const requestId = this.generateRequestId();

    const body = {
      request_id: requestId,
      serviceID,
      amount: params.amountNgn,
      phone: params.phoneNumber,
    };

    const res = await fetch(`${this.baseUrl}/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authHeader,
        "api-key": this.publicKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return {
        success: false,
        reference: requestId,
        message: `VTpass API error: ${res.status}`,
      };
    }

    const data = (await res.json()) as {
      code: string;
      content?: { transactions?: { status: string } };
      requestId?: string;
    };

    const success = data.code === "000";
    return {
      success,
      reference: data.requestId ?? requestId,
      message: success ? "Airtime delivered successfully" : `VTpass error code: ${data.code}`,
    };
  }

  async checkStatus(reference: string): Promise<StatusResult> {
    const res = await fetch(
      `${this.baseUrl}/requery?request_id=${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: this.authHeader,
          "api-key": this.publicKey,
        },
      },
    );

    if (!res.ok) {
      return { status: "pending", message: "Could not reach VTpass API" };
    }

    const data = (await res.json()) as { code: string };

    if (data.code === "000") return { status: "delivered" };
    if (data.code === "009") return { status: "pending" };
    return { status: "failed", message: `VTpass code: ${data.code}` };
  }
}

// Default export — singleton
export const airtimeSupplier = new VTpassSupplier();
