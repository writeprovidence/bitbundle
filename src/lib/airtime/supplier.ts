import { flutterwaveSupplier } from "./flutterwave";

export * from "./types";
export * from "./flutterwave";

/**
 * Primary airtime supplier for Bitbundle (Flutterwave Bills).
 */
export const airtimeSupplier = flutterwaveSupplier;
