export interface RefillOperator {
  id: "mtn" | "airtel" | "glo" | "9mobile";
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
  logoType: "mtn" | "airtel" | "glo" | "9mobile";
}

export const OPERATORS: Record<string, RefillOperator> = {
  mtn: {
    id: "mtn",
    name: "MTN",
    fullName: "MTN Refill",
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
      "MTN formerly M-Cell, is one of Nigeria's premier mobile service providers. With Bitbundle's MTN refill, you can top-up mobile minutes and data from MTN with Bitcoin, Ethereum, Dash, Dogecoin, and Litecoin.",
    cardBgColor: "bg-[#FFCC00]",
    logoType: "mtn",
  },
  airtel: {
    id: "airtel",
    name: "Airtel",
    fullName: "Airtel Refill",
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
      "Airtel Nigeria is a leading telecommunications services provider. Easily recharge airtime or data bundle with cryptocurrency in under a minute.",
    cardBgColor: "bg-white",
    logoType: "airtel",
  },
  glo: {
    id: "glo",
    name: "Glo",
    fullName: "Glo Refill",
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
      "Globacom (Glo) is Nigeria's multinational telecommunications company. Buy Glo airtime with instant digital delivery using USDT, ETH, and more.",
    cardBgColor: "bg-white",
    logoType: "glo",
  },
  "9mobile": {
    id: "9mobile",
    name: "9mobile",
    fullName: "9mobile Refill",
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
      "9mobile provides top-quality cellular services across Nigeria. Refill your phone balance or send credits to family securely with cryptocurrency.",
    cardBgColor: "bg-[#045F40]",
    logoType: "9mobile",
  },
};
