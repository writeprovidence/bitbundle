export type NetworkId = "mtn" | "airtel" | "glo" | "9mobile" | string;

export interface NetworkPrefixInfo {
  id: string;
  name: string;
  fullName: string;
  isSupportedOperator: boolean;
  prefixes: string[];
}

export interface CountryNetworkConfig {
  countryCode: string;
  countryName: string;
  dialCode: string;
  networks: Record<string, NetworkPrefixInfo>;
}

export const AFRICAN_NETWORKS_BY_COUNTRY: Record<string, CountryNetworkConfig> = {
  NG: {
    countryCode: "NG",
    countryName: "Nigeria",
    dialCode: "+234",
    networks: {
      mtn: {
        id: "mtn",
        name: "MTN",
        fullName: "MTN Nigeria",
        isSupportedOperator: true,
        prefixes: [
          "0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814",
          "0903", "0906", "0913", "0916", "07025", "07026", "0704",
        ],
      },
      airtel: {
        id: "airtel",
        name: "Airtel",
        fullName: "Airtel Nigeria",
        isSupportedOperator: true,
        prefixes: [
          "0802", "0808", "0708", "0812", "0701", "0902", "0901", "0904",
          "0907", "0912", "0911",
        ],
      },
      glo: {
        id: "glo",
        name: "Glo",
        fullName: "Glo Nigeria",
        isSupportedOperator: true,
        prefixes: [
          "0805", "0807", "0705", "0815", "0811", "0905", "0915",
        ],
      },
      "9mobile": {
        id: "9mobile",
        name: "9mobile",
        fullName: "9mobile Nigeria",
        isSupportedOperator: true,
        prefixes: [
          "0809", "0817", "0818", "0909", "0908",
        ],
      },
    },
  },
  GH: {
    countryCode: "GH",
    countryName: "Ghana",
    dialCode: "+233",
    networks: {
      mtn: {
        id: "mtn",
        name: "MTN",
        fullName: "MTN Ghana",
        isSupportedOperator: true,
        prefixes: ["024", "054", "055", "059", "025"],
      },
      airtel: {
        id: "airtel",
        name: "Airtel",
        fullName: "AirtelTigo Ghana",
        isSupportedOperator: true,
        prefixes: ["026", "056", "027", "057"],
      },
      glo: {
        id: "glo",
        name: "Glo",
        fullName: "Glo Ghana",
        isSupportedOperator: true,
        prefixes: ["023"],
      },
      telecel: {
        id: "telecel",
        name: "Telecel",
        fullName: "Telecel (Vodafone) Ghana",
        isSupportedOperator: true,
        prefixes: ["020", "050"],
      },
    },
  },
  ZA: {
    countryCode: "ZA",
    countryName: "South Africa",
    dialCode: "+27",
    networks: {
      mtn: {
        id: "mtn",
        name: "MTN",
        fullName: "MTN South Africa",
        isSupportedOperator: true,
        prefixes: ["083", "073", "078", "0710", "0717", "0718", "0719"],
      },
      vodacom: {
        id: "vodacom",
        name: "Vodacom",
        fullName: "Vodacom South Africa",
        isSupportedOperator: true,
        prefixes: ["082", "072", "076", "079", "0711", "0712", "0713", "0714", "0715", "0716"],
      },
      cellc: {
        id: "cellc",
        name: "Cell C",
        fullName: "Cell C South Africa",
        isSupportedOperator: true,
        prefixes: ["084", "074"],
      },
      telkom: {
        id: "telkom",
        name: "Telkom",
        fullName: "Telkom South Africa",
        isSupportedOperator: true,
        prefixes: ["081"],
      },
    },
  },
  KE: {
    countryCode: "KE",
    countryName: "Kenya",
    dialCode: "+254",
    networks: {
      airtel: {
        id: "airtel",
        name: "Airtel",
        fullName: "Airtel Kenya",
        isSupportedOperator: true,
        prefixes: ["073", "075", "078", "010", "011"],
      },
      safaricom: {
        id: "safaricom",
        name: "Safaricom",
        fullName: "Safaricom Kenya",
        isSupportedOperator: true,
        prefixes: ["070", "071", "072", "074", "079", "076"],
      },
      telkom: {
        id: "telkom",
        name: "Telkom",
        fullName: "Telkom Kenya",
        isSupportedOperator: false,
        prefixes: ["077"],
      },
    },
  },
  UG: {
    countryCode: "UG",
    countryName: "Uganda",
    dialCode: "+256",
    networks: {
      mtn: {
        id: "mtn",
        name: "MTN",
        fullName: "MTN Uganda",
        isSupportedOperator: true,
        prefixes: ["077", "078", "076"],
      },
      airtel: {
        id: "airtel",
        name: "Airtel",
        fullName: "Airtel Uganda",
        isSupportedOperator: true,
        prefixes: ["070", "075", "074"],
      },
      utl: {
        id: "utl",
        name: "UTL",
        fullName: "Uganda Telecom",
        isSupportedOperator: false,
        prefixes: ["071"],
      },
    },
  },
  TZ: {
    countryCode: "TZ",
    countryName: "Tanzania",
    dialCode: "+255",
    networks: {
      airtel: {
        id: "airtel",
        name: "Airtel",
        fullName: "Airtel Tanzania",
        isSupportedOperator: true,
        prefixes: ["078", "068", "069"],
      },
      vodacom: {
        id: "vodacom",
        name: "Vodacom",
        fullName: "Vodacom Tanzania",
        isSupportedOperator: true,
        prefixes: ["074", "075", "076"],
      },
      tigo: {
        id: "tigo",
        name: "Tigo",
        fullName: "Tigo Tanzania",
        isSupportedOperator: true,
        prefixes: ["071", "065", "067", "077"],
      },
      halotel: {
        id: "halotel",
        name: "Halotel",
        fullName: "Halotel Tanzania",
        isSupportedOperator: true,
        prefixes: ["061", "062"],
      },
    },
  },
};

/**
 * Normalizes a phone number for any African country using its dial code.
 */
export function normalizeAfricanPhone(phone: string, dialCode: string = "+234"): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";

  const cleanDial = dialCode.replace(/\D/g, "");
  let stripped = digits;
  if (stripped.startsWith(cleanDial) && stripped.length > cleanDial.length) {
    stripped = stripped.slice(cleanDial.length);
  }

  // Ensure leading zero if not present
  if (!stripped.startsWith("0")) {
    return "0" + stripped;
  }
  return stripped;
}

/**
 * Detects which mobile operator in a specific country owns the phone prefix.
 */
export function detectAfricanOperator(
  phone: string,
  countryCode: string = "NG"
): NetworkPrefixInfo | null {
  const countryConfig = AFRICAN_NETWORKS_BY_COUNTRY[countryCode.toUpperCase()];
  if (!countryConfig) return null;

  const normalized = normalizeAfricanPhone(phone, countryConfig.dialCode);
  if (normalized.length < 3) return null;

  for (const network of Object.values(countryConfig.networks)) {
    // Sort prefixes descending by length so longer prefixes match first
    const sorted = [...network.prefixes].sort((a, b) => b.length - a.length);
    for (const prefix of sorted) {
      if (normalized.startsWith(prefix)) {
        return network;
      }
    }
  }

  return null;
}

export interface NetworkMatchResult {
  isMatch: boolean;
  detectedOperator: NetworkPrefixInfo | null;
  selectedOperatorId: string;
  countryName: string;
  errorMessage?: string;
}

/**
 * Validates whether the entered phone number matches the selected operator in that country.
 */
export function checkNetworkMatch(
  phone: string,
  selectedOperatorId: string,
  countryCode: string = "NG"
): NetworkMatchResult {
  const code = (countryCode || "NG").toUpperCase();
  const countryConfig = AFRICAN_NETWORKS_BY_COUNTRY[code];

  if (!countryConfig) {
    return {
      isMatch: true,
      detectedOperator: null,
      selectedOperatorId,
      countryName: code,
    };
  }

  const detected = detectAfricanOperator(phone, code);
  if (!detected) {
    return {
      isMatch: true,
      detectedOperator: null,
      selectedOperatorId,
      countryName: countryConfig.countryName,
    };
  }

  const cleanSelected = selectedOperatorId.toLowerCase();
  const isMatch = detected.id.toLowerCase() === cleanSelected;

  if (!isMatch) {
    const selectedNetwork = countryConfig.networks[cleanSelected];
    const selectedName = selectedNetwork ? selectedNetwork.name : selectedOperatorId.toUpperCase();
    return {
      isMatch: false,
      detectedOperator: detected,
      selectedOperatorId,
      countryName: countryConfig.countryName,
      errorMessage: `This phone number belongs to ${detected.name} ${countryConfig.countryName}, but you are topping up ${selectedName}.`,
    };
  }

  return {
    isMatch: true,
    detectedOperator: detected,
    selectedOperatorId,
    countryName: countryConfig.countryName,
  };
}
