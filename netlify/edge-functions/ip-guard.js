// netlify/edge-functions/ip-guard.js

export default async (request, context) => {
  const visitorIP = context.ip;

  const allowedIPsRaw = Deno.env.get("ALLOWED_IPS") || "";

  // I-clean muna natin: tanggalin ang whitespace/newlines, at i-filter out ang mga blangkong entries
  // (para hindi masira kahit may trailing comma o extra spaces sa env variable)
  const allowedPatterns = allowedIPsRaw
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);

  // Function na nagche-check kung tugma ang visitor IP sa isang pattern
  // Sinusuportahan niya ang exact match (115.146.187.107)
  // At wildcard match (103.11.xxx.xxx o 103.11.*.* )
  function matchesPattern(ip, pattern) {
    const ipParts = ip.split(".");
    const patternParts = pattern.split(".");

    if (ipParts.length !== 4 || patternParts.length !== 4) return false;

    for (let i = 0; i < 4; i++) {
      const part = patternParts[i].toLowerCase();
      if (part === "xxx" || part === "*") continue; // wildcard, skip check
      if (part !== ipParts[i]) return false; // hindi tugma
    }
    return true;
  }

  const isAllowed = allowedPatterns.some((pattern) =>
    matchesPattern(visitorIP, pattern)
  );

  if (isAllowed) {
    return context.next();
  }

  return new Response(
    "403 Forbidden - This site is only accessible from an authorized network.",
    {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
};

export const config = {
  path: "/*",
};
