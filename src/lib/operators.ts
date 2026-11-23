export interface RefillOperator {
  id: string;
  name: string;
  fullName: string;
  countryName: string;
  countryCode: string;
  countryFlag: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  cardBgColor: string;
  logoType: string;
}

export type TopUpOperator = RefillOperator;

export const OPERATORS: Record<string, RefillOperator> = {
  mtn: {
    id: "mtn",
    name: "MTN",
    fullName: "MTN Top Up",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    currency: "NGN",
    minAmount: 5,
    maxAmount: 10000,
    defaultAmount: 200,
    rating: 4.8,
    reviewsCount: 257,
    description:
      "MTN is Africa's premier telecommunications network. Buy MTN mobile airtime and data with instant digital settlement.",
    cardBgColor: "bg-[#FFCC00]",
    logoType: "mtn",
  },
  airtel: {
    id: "airtel",
    name: "Airtel",
    fullName: "Airtel Top Up",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    currency: "NGN",
    minAmount: 50,
    maxAmount: 10000,
    defaultAmount: 500,
    rating: 4.9,
    reviewsCount: 312,
    description:
      "Airtel is a leading telecommunications service provider across Africa. Fast, secure mobile top-up in under 30 seconds.",
    cardBgColor: "bg-white",
    logoType: "airtel",
  },
  glo: {
    id: "glo",
    name: "Glo",
    fullName: "Glo Top Up",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    currency: "NGN",
    minAmount: 100,
    maxAmount: 10000,
    defaultAmount: 500,
    rating: 4.8,
    reviewsCount: 189,
    description:
      "Globacom (Glo) is an indigenous multinational telecommunications company. Buy Glo airtime with instant digital delivery.",
    cardBgColor: "bg-white",
    logoType: "glo",
  },
  "9mobile": {
    id: "9mobile",
    name: "9mobile",
    fullName: "9mobile Top Up",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    currency: "NGN",
    minAmount: 5,
    maxAmount: 10000,
    defaultAmount: 200,
    rating: 4.3,
    reviewsCount: 142,
    description:
      "9mobile provides high quality cellular network services across Nigeria. Top up your phone or send credits with zero hassle.",
    cardBgColor: "bg-[#045F40]",
    logoType: "9mobile",
  },
  telecel: {
    id: "telecel",
    name: "Telecel",
    fullName: "Telecel Ghana",
    countryName: "Ghana",
    countryCode: "GH",
    countryFlag: "🇬🇭",
    currency: "GHS",
    minAmount: 5,
    maxAmount: 500,
    defaultAmount: 20,
    rating: 4.7,
    reviewsCount: 178,
    description:
      "Telecel provides high-speed mobile airtime and data connectivity across Ghana.",
    cardBgColor: "bg-[#E40000]",
    logoType: "telecel",
  },
  vodacom: {
    id: "vodacom",
    name: "Vodacom",
    fullName: "Vodacom Top Up",
    countryName: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    currency: "ZAR",
    minAmount: 10,
    maxAmount: 2000,
    defaultAmount: 50,
    rating: 4.8,
    reviewsCount: 290,
    description:
      "Vodacom is one of Africa's leading mobile communications companies, operating in South Africa, Tanzania, and beyond.",
    cardBgColor: "bg-[#E60000]",
    logoType: "vodacom",
  },
  cellc: {
    id: "cellc",
    name: "Cell C",
    fullName: "Cell C Top Up",
    countryName: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    currency: "ZAR",
    minAmount: 10,
    maxAmount: 2000,
    defaultAmount: 50,
    rating: 4.5,
    reviewsCount: 134,
    description:
      "Cell C is a leading mobile provider in South Africa offering high value mobile airtime and data bundles.",
    cardBgColor: "bg-black",
    logoType: "cellc",
  },
  telkom: {
    id: "telkom",
    name: "Telkom",
    fullName: "Telkom Top Up",
    countryName: "South Africa",
    countryCode: "ZA",
    countryFlag: "🇿🇦",
    currency: "ZAR",
    minAmount: 10,
    maxAmount: 2000,
    defaultAmount: 50,
    rating: 4.6,
    reviewsCount: 156,
    description:
      "Telkom South Africa provides robust telecommunication and mobile internet services nationwide.",
    cardBgColor: "bg-[#0089CF]",
    logoType: "telkom",
  },
  safaricom: {
    id: "safaricom",
    name: "Safaricom",
    fullName: "Safaricom Top Up",
    countryName: "Kenya",
    countryCode: "KE",
    countryFlag: "🇰🇪",
    currency: "KES",
    minAmount: 50,
    maxAmount: 10000,
    defaultAmount: 200,
    rating: 4.9,
    reviewsCount: 420,
    description:
      "Safaricom is Kenya's premier telecommunications company, home to M-Pesa and Kenya's fastest 4G/5G mobile network.",
    cardBgColor: "bg-[#009E49]",
    logoType: "safaricom",
  },
  tigo: {
    id: "tigo",
    name: "Tigo",
    fullName: "Tigo Top Up",
    countryName: "Tanzania",
    countryCode: "TZ",
    countryFlag: "🇹🇿",
    currency: "TZS",
    minAmount: 1000,
    maxAmount: 100000,
    defaultAmount: 5000,
    rating: 4.7,
    reviewsCount: 165,
    description:
      "Tigo Tanzania (part of Axian Telecom) connects millions of subscribers with reliable cellular recharge and data.",
    cardBgColor: "bg-[#0033A0]",
    logoType: "tigo",
  },
  halotel: {
    id: "halotel",
    name: "Halotel",
    fullName: "Halotel Top Up",
    countryName: "Tanzania",
    countryCode: "TZ",
    countryFlag: "🇹🇿",
    currency: "TZS",
    minAmount: 1000,
    maxAmount: 100000,
    defaultAmount: 5000,
    rating: 4.6,
    reviewsCount: 112,
    description:
      "Halotel provides extensive mobile telecommunication services with wide rural and urban reach in Tanzania.",
    cardBgColor: "bg-[#FF6600]",
    logoType: "halotel",
  },
};
