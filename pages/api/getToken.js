// pages/api/getToken.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // ✅ CORS headers add karo
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // 🔥 Preflight request ke liye
  }

  try {
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id,
        client_secret,
        refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data });
    }

    res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
