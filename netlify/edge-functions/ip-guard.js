export default async (request, context) => {
  // Netlify automatically detects the visitor's real IP and puts it here
  const visitorIP = context.ip;

  // Kunin natin yung allowed IPs mula sa environment variable
  // Comma-separated kung ilan man ang gusto mong i-allow (office, home, VPN)
  const allowedIPsRaw = Deno.env.get("ALLOWED_IPS") || "";
  const allowedIPs = allowedIPsRaw.split(",").map((ip) => ip.trim());

  // Kung nasa listahan yung visitor IP, ipasa siya sa actual site
  if (allowedIPs.includes(visitorIP)) {
    return context.next();
  }

  // Kung hindi match, i-block natin siya
  return new Response(
    "403 Forbidden — This site is only accessible from an authorized network.",
    {
      status: 403,
      headers: { "Content-Type": "text/plain" },
    }
  );
};

export const config = {
  path: "/*", // i-apply sa lahat ng pages/routes ng site
};