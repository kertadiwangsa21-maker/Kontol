import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders, setCorsHeaders } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const data = await proxyAnimeApi("/anime/home");
    setCacheHeaders(res, 3600);
    res.json(data);
  } catch (error) {
    console.error("Error fetching home data:", error);
    res.status(500).json({ error: "Failed to fetch anime home data" });
  }
}
