import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders, setCorsHeaders, validatePage } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const page = validatePage(req.query.page);
    const data = await proxyAnimeApi(`/anime/ongoing-anime?page=${page}`);
    setCacheHeaders(res, 1800);
    res.json(data);
  } catch (error) {
    console.error("Error fetching ongoing anime:", error);
    res.status(500).json({ error: "Failed to fetch ongoing anime" });
  }
}
