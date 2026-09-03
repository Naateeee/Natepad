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
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#08111f">
    <title>403 Forbidden</title>
    <style>
      :root {
        color-scheme: dark;
        --ink: #f4f7fb;
        --muted: #9eabbc;
        --accent: #ffb86b;
        --line: rgba(158, 171, 188, .25);
        --panel: rgba(13, 27, 46, .78);
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: 24px;
        color: var(--ink);
        background: #08111f;
        font-family: Georgia, "Times New Roman", serif;
      }

      body::before,
      body::after {
        content: "";
        position: fixed;
        z-index: -1;
        width: 42vmax;
        height: 42vmax;
        border: 1px solid var(--line);
        border-radius: 50%;
        animation: drift 13s ease-in-out infinite alternate;
      }

      body::before { top: -28vmax; right: -12vmax; }
      body::after { bottom: -31vmax; left: -15vmax; animation-delay: -5s; }

      main {
        width: min(100%, 680px);
        padding: clamp(34px, 8vw, 76px);
        position: relative;
        text-align: center;
        background: var(--panel);
        border: 1px solid var(--line);
        box-shadow: 0 24px 80px rgba(0, 0, 0, .34);
        animation: arrive .8s cubic-bezier(.22, 1, .36, 1) both;
      }

      .signal {
        width: 96px;
        height: 96px;
        margin: 0 auto 30px;
        display: grid;
        place-items: center;
        position: relative;
        border: 1px solid var(--accent);
        border-radius: 50%;
        color: var(--accent);
        font: 700 25px/1 Georgia, serif;
        animation: pulse 2.8s ease-in-out infinite;
      }

      .signal::before,
      .signal::after {
        content: "";
        position: absolute;
        inset: -13px;
        border: 1px solid rgba(255, 184, 107, .34);
        border-radius: 50%;
        animation: ping 2.8s ease-out infinite;
      }

      .signal::after { animation-delay: 1.4s; }

      .eyebrow {
        margin: 0 0 12px;
        color: var(--accent);
        font: 700 12px/1.2 Consolas, monospace;
        letter-spacing: 3px;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(42px, 10vw, 76px);
        font-weight: 400;
        letter-spacing: 0;
        line-height: .98;
      }

      p {
        max-width: 430px;
        margin: 22px auto 0;
        color: var(--muted);
        font: 17px/1.65 Consolas, monospace;
      }

      .rule {
        width: 52px;
        height: 1px;
        margin: 30px auto 0;
        background: var(--accent);
      }

      @keyframes arrive {
        from { opacity: 0; transform: translateY(18px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        50% { box-shadow: 0 0 0 9px rgba(255, 184, 107, .06); }
      }

      @keyframes ping {
        0% { opacity: .7; transform: scale(.72); }
        100% { opacity: 0; transform: scale(1.35); }
      }

      @keyframes drift {
        to { transform: translate(22px, 18px); }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
      }
    </style>
  </head>
  <body>
    <main>
      <div class="signal" aria-hidden="true">403</div>
      <p class="eyebrow">Access restricted</p>
      <h1>Forbidden</h1>
      <p>403 Forbidden - This site is only accessible from an authorized network.</p>
      <div class="rule" aria-hidden="true"></div>
    </main>
  </body>
</html>`,
    {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    }
  );
};

export const config = {
  path: "/*",
};
