import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Headers injected by Vercel, Cloudflare, AWS CloudFront, etc.
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("cloudfront-viewer-country") ||
    req.headers.get("x-country-code") ||
    null;

  return NextResponse.json({
    country: country ? country.toUpperCase() : null,
  });
}

