// api/telegram-proxy.js
// Vercel serverless function - handles Telegram API proxy requests

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version",
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { url, method = "POST", headers = {}, body } = req.body;

    // Validate URL (only allow Telegram API)
    if (!url || !url.startsWith("https://api.telegram.org/")) {
      return res.status(400).json({ ok: false, error: "Invalid URL" });
    }

    // Make request to Telegram API
    const fetchOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const telegramRes = await fetch(url, fetchOptions);
    const data = await telegramRes.json();

    return res.status(telegramRes.status).json(data);
  } catch (err) {
    console.error("Telegram proxy error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || "Server error",
    });
  }
}
