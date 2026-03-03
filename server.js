const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve static site
app.use(express.static(path.join(__dirname)));

// Telegram proxy endpoint
app.post("/telegram-proxy", async (req, res) => {
  try {
    const { url, method = "POST", headers = {}, body } = req.body;
    if (!url || !url.startsWith("https://api.telegram.org/")) {
      return res.status(400).json({ ok: false, error: "invalid_url" });
    }

    const axiosConfig = {
      method: method,
      url: url,
      responseType: "json",
      headers: Object.assign({}, headers),
      data: body,
      timeout: 15000,
    };

    // If body is an object with form fields, allow sending as is
    const resp = await axios(axiosConfig);
    return res.status(200).json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    return res.status(status).json({ ok: false, error: data });
  }
});

app.listen(port, () => {
  console.log(
    `Static server + telegram proxy running at http://localhost:${port}`,
  );
});
