import type { VercelRequest, VercelResponse } from "@vercel/node";

const SANKAVOLLEREI_BASE_URL = "https://www.sankavollerei.com";

function setCacheHeaders(res: VercelResponse, maxAge: number) {
  res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
  res.setHeader("Expires", new Date(Date.now() + maxAge * 1000).toUTCString());
}

async function proxyAnimeApi(endpoint: string) {
  const response = await fetch(`${SANKAVOLLEREI_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  const json = await response.json();
  
  if (json.status === "success" && json.data) {
    return json.data;
  }
  
  return json;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Get path from query parameter
    let path = (req.query.path || "") as string;
    if (Array.isArray(path)) {
      path = path.join("/");
    }
    
    let endpoint = `/anime/${path}`;
    
    // Build query string if exists
    const queryParams = new URLSearchParams();
    if (req.query.page) {
      queryParams.append("page", req.query.page as string);
    }
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    
    // Determine cache duration based on endpoint
    let cacheTime = 3600;
    if (path.includes("schedule")) cacheTime = 86400;
    else if (path.includes("genre")) cacheTime = 86400;
    else if (path.includes("complete") || path.includes("ongoing")) cacheTime = 1800;
    else if (path.includes("search")) cacheTime = 1800;
    else if (path.includes("episode") || path.includes("batch")) cacheTime = 3600;
    else if (path.includes("server")) cacheTime = 600;
    else if (path.includes("unlimited")) cacheTime = 7200;

    if (req.method === "POST") {
      const { serverId } = req.body;
      if (!serverId || typeof serverId !== "string") {
        return res.status(400).json({ error: "serverId is required" });
      }
      const data = await proxyAnimeApi(serverId);
      setCacheHeaders(res, 600);
      return res.json(data);
    }

    const data = await proxyAnimeApi(endpoint);
    setCacheHeaders(res, cacheTime);
    return res.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Failed to proxy request" });
  }
}
