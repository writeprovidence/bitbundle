export interface DataBundlePlan {
  id: string;
  name: string; // e.g. "1.5 GB", "5 GB", "10 GB"
  validity: string; // e.g. "30 Days", "7 Days", "1 Day", "2 Days"
  dataAmount: string; // e.g. "1.5 GB"
  priceLocal: number; // in local currency
  currency: string;
  category: "daily" | "weekly" | "monthly";
  badge?: "Popular" | "Best Value" | "Hot" | "Super Saver";
}

export const DATA_BUNDLES: Record<string, Record<string, DataBundlePlan[]>> = {
  // Nigeria (NGN)
  NG: {
    mtn: [
      { id: "mtn-ng-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 350, currency: "NGN", category: "daily" },
      { id: "mtn-ng-2gb-2d", name: "2.5 GB 2-Days", dataAmount: "2.5 GB", validity: "2 Days", priceLocal: 600, currency: "NGN", category: "daily", badge: "Hot" },
      { id: "mtn-ng-1.5gb-30d", name: "1.5 GB Monthly", dataAmount: "1.5 GB", validity: "30 Days", priceLocal: 1200, currency: "NGN", category: "monthly" },
      { id: "mtn-ng-3gb-30d", name: "3 GB Monthly", dataAmount: "3 GB", validity: "30 Days", priceLocal: 1800, currency: "NGN", category: "monthly" },
      { id: "mtn-ng-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 2500, currency: "NGN", category: "monthly", badge: "Popular" },
      { id: "mtn-ng-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 4000, currency: "NGN", category: "monthly", badge: "Best Value" },
      { id: "mtn-ng-20gb-30d", name: "20 GB Monthly", dataAmount: "20 GB", validity: "30 Days", priceLocal: 7500, currency: "NGN", category: "monthly" },
      { id: "mtn-ng-40gb-30d", name: "40 GB Mega", dataAmount: "40 GB", validity: "30 Days", priceLocal: 12500, currency: "NGN", category: "monthly", badge: "Super Saver" },
    ],
    airtel: [
      { id: "airtel-ng-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 350, currency: "NGN", category: "daily" },
      { id: "airtel-ng-2gb-2d", name: "2 GB 2-Days", dataAmount: "2 GB", validity: "2 Days", priceLocal: 600, currency: "NGN", category: "daily" },
      { id: "airtel-ng-1.5gb-30d", name: "1.5 GB Monthly", dataAmount: "1.5 GB", validity: "30 Days", priceLocal: 1200, currency: "NGN", category: "monthly" },
      { id: "airtel-ng-4gb-30d", name: "4 GB Monthly", dataAmount: "4 GB", validity: "30 Days", priceLocal: 2000, currency: "NGN", category: "monthly" },
      { id: "airtel-ng-6gb-30d", name: "6 GB Monthly", dataAmount: "6 GB", validity: "30 Days", priceLocal: 2500, currency: "NGN", category: "monthly", badge: "Popular" },
      { id: "airtel-ng-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 4000, currency: "NGN", category: "monthly", badge: "Best Value" },
      { id: "airtel-ng-20gb-30d", name: "20 GB Monthly", dataAmount: "20 GB", validity: "30 Days", priceLocal: 7500, currency: "NGN", category: "monthly" },
      { id: "airtel-ng-40gb-30d", name: "40 GB Mega", dataAmount: "40 GB", validity: "30 Days", priceLocal: 12000, currency: "NGN", category: "monthly", badge: "Super Saver" },
    ],
    glo: [
      { id: "glo-ng-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 300, currency: "NGN", category: "daily" },
      { id: "glo-ng-2.5gb-2d", name: "2.5 GB 2-Days", dataAmount: "2.5 GB", validity: "2 Days", priceLocal: 500, currency: "NGN", category: "daily", badge: "Hot" },
      { id: "glo-ng-2.9gb-30d", name: "2.9 GB Monthly", dataAmount: "2.9 GB", validity: "30 Days", priceLocal: 1000, currency: "NGN", category: "monthly" },
      { id: "glo-ng-5.8gb-30d", name: "5.8 GB Monthly", dataAmount: "5.8 GB", validity: "30 Days", priceLocal: 2000, currency: "NGN", category: "monthly", badge: "Popular" },
      { id: "glo-ng-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 3000, currency: "NGN", category: "monthly", badge: "Best Value" },
      { id: "glo-ng-18gb-30d", name: "18 GB Monthly", dataAmount: "18 GB", validity: "30 Days", priceLocal: 5000, currency: "NGN", category: "monthly" },
      { id: "glo-ng-36gb-30d", name: "36 GB Mega", dataAmount: "36 GB", validity: "30 Days", priceLocal: 8000, currency: "NGN", category: "monthly", badge: "Super Saver" },
    ],
    "9mobile": [
      { id: "9mob-ng-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 350, currency: "NGN", category: "daily" },
      { id: "9mob-ng-2gb-3d", name: "2 GB 3-Days", dataAmount: "2 GB", validity: "3 Days", priceLocal: 600, currency: "NGN", category: "daily" },
      { id: "9mob-ng-1.5gb-30d", name: "1.5 GB Monthly", dataAmount: "1.5 GB", validity: "30 Days", priceLocal: 1200, currency: "NGN", category: "monthly" },
      { id: "9mob-ng-4.5gb-30d", name: "4.5 GB Monthly", dataAmount: "4.5 GB", validity: "30 Days", priceLocal: 2000, currency: "NGN", category: "monthly", badge: "Popular" },
      { id: "9mob-ng-11gb-30d", name: "11 GB Monthly", dataAmount: "11 GB", validity: "30 Days", priceLocal: 4000, currency: "NGN", category: "monthly", badge: "Best Value" },
      { id: "9mob-ng-20gb-30d", name: "20 GB Monthly", dataAmount: "20 GB", validity: "30 Days", priceLocal: 7500, currency: "NGN", category: "monthly" },
    ],
  },

  // Ghana (GHS)
  GH: {
    mtn: [
      { id: "mtn-gh-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 6, currency: "GHS", category: "daily" },
      { id: "mtn-gh-2.5gb-7d", name: "2.5 GB Weekly", dataAmount: "2.5 GB", validity: "7 Days", priceLocal: 15, currency: "GHS", category: "weekly", badge: "Hot" },
      { id: "mtn-gh-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 40, currency: "GHS", category: "monthly", badge: "Popular" },
      { id: "mtn-gh-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 75, currency: "GHS", category: "monthly", badge: "Best Value" },
      { id: "mtn-gh-20gb-30d", name: "20 GB Monthly", dataAmount: "20 GB", validity: "30 Days", priceLocal: 130, currency: "GHS", category: "monthly" },
    ],
    airtel: [
      { id: "at-gh-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 5, currency: "GHS", category: "daily" },
      { id: "at-gh-2.5gb-7d", name: "2.5 GB Weekly", dataAmount: "2.5 GB", validity: "7 Days", priceLocal: 14, currency: "GHS", category: "weekly" },
      { id: "at-gh-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 35, currency: "GHS", category: "monthly", badge: "Popular" },
      { id: "at-gh-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 70, currency: "GHS", category: "monthly", badge: "Best Value" },
    ],
    telecel: [
      { id: "tele-gh-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 6, currency: "GHS", category: "daily" },
      { id: "tele-gh-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 18, currency: "GHS", category: "weekly", badge: "Hot" },
      { id: "tele-gh-6gb-30d", name: "6 GB Monthly", dataAmount: "6 GB", validity: "30 Days", priceLocal: 45, currency: "GHS", category: "monthly", badge: "Popular" },
      { id: "tele-gh-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 85, currency: "GHS", category: "monthly", badge: "Best Value" },
    ],
    vodafone: [
      { id: "voda-gh-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 6, currency: "GHS", category: "daily" },
      { id: "voda-gh-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 18, currency: "GHS", category: "weekly", badge: "Hot" },
      { id: "voda-gh-6gb-30d", name: "6 GB Monthly", dataAmount: "6 GB", validity: "30 Days", priceLocal: 45, currency: "GHS", category: "monthly", badge: "Popular" },
      { id: "voda-gh-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 85, currency: "GHS", category: "monthly", badge: "Best Value" },
    ],
    glo: [
      { id: "glo-gh-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 5, currency: "GHS", category: "daily" },
      { id: "glo-gh-2.5gb-7d", name: "2.5 GB Weekly", dataAmount: "2.5 GB", validity: "7 Days", priceLocal: 12, currency: "GHS", category: "weekly" },
      { id: "glo-gh-5.5gb-30d", name: "5.5 GB Monthly", dataAmount: "5.5 GB", validity: "30 Days", priceLocal: 30, currency: "GHS", category: "monthly", badge: "Popular" },
      { id: "glo-gh-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 60, currency: "GHS", category: "monthly", badge: "Best Value" },
    ],
  },

  // South Africa (ZAR)
  ZA: {
    vodacom: [
      { id: "voda-za-1gb-7d", name: "1 GB Weekly", dataAmount: "1 GB", validity: "7 Days", priceLocal: 59, currency: "ZAR", category: "weekly" },
      { id: "voda-za-2gb-30d", name: "2 GB Monthly", dataAmount: "2 GB", validity: "30 Days", priceLocal: 129, currency: "ZAR", category: "monthly" },
      { id: "voda-za-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 249, currency: "ZAR", category: "monthly", badge: "Popular" },
      { id: "voda-za-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 429, currency: "ZAR", category: "monthly", badge: "Best Value" },
      { id: "voda-za-20gb-30d", name: "20 GB Monthly", dataAmount: "20 GB", validity: "30 Days", priceLocal: 699, currency: "ZAR", category: "monthly" },
    ],
    mtn: [
      { id: "mtn-za-1gb-7d", name: "1 GB Weekly", dataAmount: "1 GB", validity: "7 Days", priceLocal: 55, currency: "ZAR", category: "weekly" },
      { id: "mtn-za-2.5gb-30d", name: "2.5 GB Monthly", dataAmount: "2.5 GB", validity: "30 Days", priceLocal: 149, currency: "ZAR", category: "monthly" },
      { id: "mtn-za-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 239, currency: "ZAR", category: "monthly", badge: "Popular" },
      { id: "mtn-za-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 399, currency: "ZAR", category: "monthly", badge: "Best Value" },
    ],
    cellc: [
      { id: "cellc-za-1gb-7d", name: "1 GB Weekly", dataAmount: "1 GB", validity: "7 Days", priceLocal: 49, currency: "ZAR", category: "weekly" },
      { id: "cellc-za-2gb-30d", name: "2 GB Monthly", dataAmount: "2 GB", validity: "30 Days", priceLocal: 119, currency: "ZAR", category: "monthly" },
      { id: "cellc-za-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 219, currency: "ZAR", category: "monthly", badge: "Popular" },
      { id: "cellc-za-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 379, currency: "ZAR", category: "monthly", badge: "Best Value" },
    ],
    telkom: [
      { id: "telkom-za-1.5gb-30d", name: "1.5 GB Monthly", dataAmount: "1.5 GB", validity: "30 Days", priceLocal: 89, currency: "ZAR", category: "monthly" },
      { id: "telkom-za-4gb-30d", name: "4 GB Monthly", dataAmount: "4 GB", validity: "30 Days", priceLocal: 179, currency: "ZAR", category: "monthly", badge: "Popular" },
      { id: "telkom-za-7.5gb-30d", name: "7.5 GB Monthly", dataAmount: "7.5 GB", validity: "30 Days", priceLocal: 249, currency: "ZAR", category: "monthly", badge: "Best Value" },
    ],
  },

  // Kenya (KES)
  KE: {
    safaricom: [
      { id: "saf-ke-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 100, currency: "KES", category: "daily" },
      { id: "saf-ke-2.5gb-7d", name: "2.5 GB Weekly", dataAmount: "2.5 GB", validity: "7 Days", priceLocal: 250, currency: "KES", category: "weekly", badge: "Hot" },
      { id: "saf-ke-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 500, currency: "KES", category: "monthly", badge: "Popular" },
      { id: "saf-ke-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 1000, currency: "KES", category: "monthly", badge: "Best Value" },
      { id: "saf-ke-25gb-30d", name: "25 GB Monthly", dataAmount: "25 GB", validity: "30 Days", priceLocal: 2000, currency: "KES", category: "monthly", badge: "Super Saver" },
    ],
    airtel: [
      { id: "air-ke-1.5gb-1d", name: "1.5 GB Daily", dataAmount: "1.5 GB", validity: "1 Day", priceLocal: 100, currency: "KES", category: "daily" },
      { id: "air-ke-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 250, currency: "KES", category: "weekly" },
      { id: "air-ke-6gb-30d", name: "6 GB Monthly", dataAmount: "6 GB", validity: "30 Days", priceLocal: 500, currency: "KES", category: "monthly", badge: "Popular" },
      { id: "air-ke-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 1000, currency: "KES", category: "monthly", badge: "Best Value" },
    ],
    telkom: [
      { id: "tel-ke-1.5gb-1d", name: "1.5 GB Daily", dataAmount: "1.5 GB", validity: "1 Day", priceLocal: 100, currency: "KES", category: "daily" },
      { id: "tel-ke-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 250, currency: "KES", category: "weekly", badge: "Hot" },
      { id: "tel-ke-5gb-30d", name: "5 GB Monthly", dataAmount: "5 GB", validity: "30 Days", priceLocal: 450, currency: "KES", category: "monthly", badge: "Popular" },
      { id: "tel-ke-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 950, currency: "KES", category: "monthly", badge: "Best Value" },
    ],
  },

  // Uganda (UGX)
  UG: {
    mtn: [
      { id: "mtn-ug-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 5000, currency: "UGX", category: "daily" },
      { id: "mtn-ug-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 15000, currency: "UGX", category: "weekly", badge: "Hot" },
      { id: "mtn-ug-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 50000, currency: "UGX", category: "monthly", badge: "Popular" },
      { id: "mtn-ug-25gb-30d", name: "25 GB Monthly", dataAmount: "25 GB", validity: "30 Days", priceLocal: 100000, currency: "UGX", category: "monthly", badge: "Best Value" },
    ],
    airtel: [
      { id: "air-ug-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 5000, currency: "UGX", category: "daily" },
      { id: "air-ug-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 15000, currency: "UGX", category: "weekly" },
      { id: "air-ug-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 50000, currency: "UGX", category: "monthly", badge: "Popular" },
      { id: "air-ug-25gb-30d", name: "25 GB Monthly", dataAmount: "25 GB", validity: "30 Days", priceLocal: 100000, currency: "UGX", category: "monthly", badge: "Best Value" },
    ],
  },

  // Tanzania (TZS)
  TZ: {
    vodacom: [
      { id: "voda-tz-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 3000, currency: "TZS", category: "daily" },
      { id: "voda-tz-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 8000, currency: "TZS", category: "weekly", badge: "Hot" },
      { id: "voda-tz-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 25000, currency: "TZS", category: "monthly", badge: "Popular" },
      { id: "voda-tz-25gb-30d", name: "25 GB Monthly", dataAmount: "25 GB", validity: "30 Days", priceLocal: 50000, currency: "TZS", category: "monthly", badge: "Best Value" },
    ],
    airtel: [
      { id: "air-tz-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 3000, currency: "TZS", category: "daily" },
      { id: "air-tz-3.5gb-7d", name: "3.5 GB Weekly", dataAmount: "3.5 GB", validity: "7 Days", priceLocal: 8000, currency: "TZS", category: "weekly" },
      { id: "air-tz-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 25000, currency: "TZS", category: "monthly", badge: "Popular" },
    ],
    tigo: [
      { id: "tigo-tz-1gb-1d", name: "1 GB Daily", dataAmount: "1 GB", validity: "1 Day", priceLocal: 3000, currency: "TZS", category: "daily" },
      { id: "tigo-tz-3gb-7d", name: "3 GB Weekly", dataAmount: "3 GB", validity: "7 Days", priceLocal: 8000, currency: "TZS", category: "weekly" },
      { id: "tigo-tz-10gb-30d", name: "10 GB Monthly", dataAmount: "10 GB", validity: "30 Days", priceLocal: 25000, currency: "TZS", category: "monthly", badge: "Popular" },
    ],
    halotel: [
      { id: "halo-tz-1.2gb-1d", name: "1.2 GB Daily", dataAmount: "1.2 GB", validity: "1 Day", priceLocal: 2500, currency: "TZS", category: "daily" },
      { id: "halo-tz-4gb-7d", name: "4 GB Weekly", dataAmount: "4 GB", validity: "7 Days", priceLocal: 7500, currency: "TZS", category: "weekly", badge: "Hot" },
      { id: "halo-tz-12gb-30d", name: "12 GB Monthly", dataAmount: "12 GB", validity: "30 Days", priceLocal: 24000, currency: "TZS", category: "monthly", badge: "Best Value" },
    ],
  },
};

/**
 * Returns available data bundle plans for a country and operator.
 * Fallbacks cleanly to a standard set if the operator has no custom override.
 */
export function getDataBundles(countryCode: string, operatorId: string): DataBundlePlan[] {
  const code = (countryCode || "NG").toUpperCase();
  const op = (operatorId || "mtn").toLowerCase();
  
  if (DATA_BUNDLES[code] && DATA_BUNDLES[code][op]) {
    return DATA_BUNDLES[code][op];
  }

  // Fallback to the country's first operator or NG MTN
  if (DATA_BUNDLES[code]) {
    const firstOp = Object.keys(DATA_BUNDLES[code])[0];
    if (firstOp) return DATA_BUNDLES[code][firstOp];
  }

  return DATA_BUNDLES.NG.mtn;
}

