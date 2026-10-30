// Airtime supplier abstraction — swap providers without changing business logic

export type Network = "mtn" | "airtel" | "glo" | "9mobile";

export interface PurchaseParams {
  network: Network;
  phoneNumber: string; // In international format without +, e.g. 2348012345678
  amountNgn: number;
}

export interface PurchaseResult {
  success: boolean;
  reference: string; // Supplier's transaction reference
  message?: string;
}

export interface StatusResult {
  status: "pending" | "delivered" | "failed";
  message?: string;
}

export interface AirtimeSupplier {
  purchase(params: PurchaseParams): Promise<PurchaseResult>;
  checkStatus(reference: string): Promise<StatusResult>;
}
