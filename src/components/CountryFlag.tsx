import React from "react";

interface CountryFlagProps {
  countryCode?: string;
  countryName?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function CountryFlag({
  countryCode = "NG",
  countryName = "Nigeria",
  className = "w-5 h-3.5 rounded-[2px] shadow-2xs border border-black/10 shrink-0 object-cover",
  width = 20,
  height = 14,
}: CountryFlagProps) {
  const code = (countryCode || "").toUpperCase();
  const name = (countryName || "").toLowerCase();

  // Nigeria: Green - White - Green vertical triband
  if (code === "NG" || name.includes("nigeria")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Nigeria Flag"
      >
        <rect width="7" height="14" fill="#008751" />
        <rect x="7" width="7" height="14" fill="#FFFFFF" />
        <rect x="14" width="7" height="14" fill="#008751" />
      </svg>
    );
  }

  // Ghana: Red - Yellow - Green horizontal triband with black star
  if (code === "GH" || name.includes("ghana")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Ghana Flag"
      >
        <rect width="21" height="4.66" fill="#D40026" />
        <rect y="4.66" width="21" height="4.66" fill="#FFD100" />
        <rect y="9.33" width="21" height="4.66" fill="#006B3F" />
        <polygon
          points="10.5,5.2 11.2,7.2 13.2,7.2 11.6,8.4 12.2,10.4 10.5,9.2 8.8,10.4 9.4,8.4 7.8,7.2 9.8,7.2"
          fill="#000000"
        />
      </svg>
    );
  }

  // Côte d'Ivoire: Orange - White - Green
  if (code === "CI" || name.includes("ivoire") || name.includes("ivory")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Côte d'Ivoire Flag"
      >
        <rect width="7" height="14" fill="#F77F00" />
        <rect x="7" width="7" height="14" fill="#FFFFFF" />
        <rect x="14" width="7" height="14" fill="#009E60" />
      </svg>
    );
  }

  // Cameroon: Green - Red - Yellow with yellow star
  if (code === "CM" || name.includes("cameroon")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Cameroon Flag"
      >
        <rect width="7" height="14" fill="#007A5E" />
        <rect x="7" width="7" height="14" fill="#CE1126" />
        <rect x="14" width="7" height="14" fill="#FCD116" />
        <polygon
          points="10.5,5.2 11.2,7.2 13.2,7.2 11.6,8.4 12.2,10.4 10.5,9.2 8.8,10.4 9.4,8.4 7.8,7.2 9.8,7.2"
          fill="#FCD116"
        />
      </svg>
    );
  }

  // Benin: Green hoist, yellow top, red bottom
  if (code === "BJ" || name.includes("benin")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Benin Flag"
      >
        <rect width="8.4" height="14" fill="#008751" />
        <rect x="8.4" width="12.6" height="7" fill="#FCD116" />
        <rect x="8.4" y="7" width="12.6" height="7" fill="#E8112D" />
      </svg>
    );
  }

  // South Africa
  if (code === "ZA" || name.includes("south africa")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="South Africa Flag"
      >
        <rect width="21" height="7" fill="#E03C31" />
        <rect y="7" width="21" height="7" fill="#001489" />
        <polygon points="0,0 8,7 0,14" fill="#000000" />
        <polygon points="0,0 9.5,7 0,14" stroke="#FFB81C" strokeWidth="1" fill="none" />
        <path d="M0,0 L10,7 L21,7 M0,14 L10,7" stroke="#007749" strokeWidth="2.5" fill="none" />
      </svg>
    );
  }

  // Kenya
  if (code === "KE" || name.includes("kenya")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Kenya Flag"
      >
        <rect width="21" height="4" fill="#000000" />
        <rect y="4" width="21" height="6" fill="#BB0000" />
        <rect y="10" width="21" height="4" fill="#006600" />
        <line x1="0" y1="4" x2="21" y2="4" stroke="#FFFFFF" strokeWidth="0.8" />
        <line x1="0" y1="10" x2="21" y2="10" stroke="#FFFFFF" strokeWidth="0.8" />
        <ellipse cx="10.5" cy="7" rx="2.5" ry="4" fill="#BB0000" stroke="#FFFFFF" strokeWidth="0.5" />
      </svg>
    );
  }

  // Uganda
  if (code === "UG" || name.includes("uganda")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Uganda Flag"
      >
        <rect width="21" height="2.33" fill="#000000" />
        <rect y="2.33" width="21" height="2.33" fill="#FCDC04" />
        <rect y="4.66" width="21" height="2.33" fill="#D90000" />
        <rect y="7" width="21" height="2.33" fill="#000000" />
        <rect y="9.33" width="21" height="2.33" fill="#FCDC04" />
        <rect y="11.66" width="21" height="2.34" fill="#D90000" />
        <circle cx="10.5" cy="7" r="2.2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Rwanda
  if (code === "RW" || name.includes("rwanda")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Rwanda Flag"
      >
        <rect width="21" height="7" fill="#00A1DE" />
        <rect y="7" width="21" height="3.5" fill="#FAD201" />
        <rect y="10.5" width="21" height="3.5" fill="#20603D" />
        <circle cx="17" cy="3.5" r="1.5" fill="#FAD201" />
      </svg>
    );
  }

  // Zambia: Green with red, black, orange vertical stripes
  if (code === "ZM" || name.includes("zambia")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Zambia Flag"
      >
        <rect width="21" height="14" fill="#198A00" />
        <rect x="14" y="5.25" width="2.33" height="8.75" fill="#DE2010" />
        <rect x="16.33" y="5.25" width="2.33" height="8.75" fill="#000000" />
        <rect x="18.66" y="5.25" width="2.34" height="8.75" fill="#EF7D00" />
      </svg>
    );
  }

  // Tanzania: Diagonal stripes of green, black with yellow edges, blue
  if (code === "TZ" || name.includes("tanzania")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Tanzania Flag"
      >
        <polygon points="0,0 21,0 0,14" fill="#1EB53A" />
        <polygon points="21,0 21,14 0,14" fill="#00A3DD" />
        <polygon points="0,14 5.25,14 21,3.5 21,0 15.75,0 0,10.5" fill="#FCD116" />
        <polygon points="0,14 3.5,14 21,2.2 21,0 17.5,0 0,11.8" fill="#000000" />
      </svg>
    );
  }

  // DR Congo: Sky blue with yellow star and diagonal red stripe with yellow borders
  if (code === "CD" || name.includes("congo")) {
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="DR Congo Flag"
      >
        <rect width="21" height="14" fill="#007FFF" />
        <polygon points="0,14 3.5,14 21,1.75 21,0 17.5,0 0,12.25" fill="#F7D618" />
        <polygon points="0,14 2.2,14 21,0.9 21,0 18.8,0 0,13.1" fill="#CE1021" />
        <polygon points="3.1,1.75 3.5,2.8 4.5,2.8 3.7,3.5 4,4.55 3.1,3.95 2.1,4.55 2.45,3.5 1.6,2.8 2.65,2.8" fill="#F7D618" />
      </svg>
    );
  }

  // Fallback default: Nigeria
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${countryName} Flag`}
    >
      <rect width="7" height="14" fill="#008751" />
      <rect x="7" width="7" height="14" fill="#FFFFFF" />
      <rect x="14" width="7" height="14" fill="#008751" />
    </svg>
  );
}

