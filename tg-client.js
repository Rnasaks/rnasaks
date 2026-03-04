// tg-client.js
// Intercepts browser fetch requests to api.telegram.org and forwards them to
// the local /telegram-proxy endpoint so the server performs the request (no CORS).

(function () {
  if (window.__TG_CLIENT_INSTALLED__) return;
  window.__TG_CLIENT_INSTALLED__ = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async function (input, init = {}) {
    try {
      const url = typeof input === "string" ? input : input.url;
      if (
        typeof url === "string" &&
        url.startsWith("https://api.telegram.org/")
      ) {
        // Collect body text if present
        let bodyText = null;
        if (init && init.body) {
          if (typeof init.body === "string") bodyText = init.body;
          else if (init.body instanceof FormData) {
            const obj = {};
            for (const [k, v] of init.body.entries()) obj[k] = v;
            bodyText = obj;
          } else if (init.body instanceof URLSearchParams) {
            bodyText = init.body.toString();
          } else {
            try {
              bodyText = JSON.parse(init.body);
            } catch {
              bodyText = String(init.body);
            }
          }
        }

        // on Vercel the serverless function is under /api
        const proxyResp = await originalFetch("/api/telegram-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            method: init.method || "POST",
            headers: init.headers || {},
            body: bodyText,
          }),
        });

        // Recreate a Response-like object for calling code
        const json = await proxyResp.json().catch(() => null);
        const ok =
          proxyResp.ok &&
          json &&
          (json.ok === true || typeof json.ok === "undefined");
        const blob = new Blob([JSON.stringify(json || {})], {
          type: "application/json",
        });
        return new Response(blob, {
          status: proxyResp.status,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (e) {
      console.error("tg-client proxy error", e);
    }
    return originalFetch(input, init);
  };
})();
