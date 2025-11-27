const SANKAVOLLEREI_BASE_URL = "https://www.sankavollerei.com";

export function validatePage(page: any): number {
  const pageNum = parseInt(page, 10);
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
}

export function validateKeyword(keyword: any): string {
  if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
    throw new Error("Keyword is required and cannot be empty");
  }
  return keyword.trim().substring(0, 100);
}

export function validateGenreSlug(slug: any): string {
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    throw new Error("Genre slug is required");
  }
  return slug.trim().substring(0, 50);
}

export function setCacheHeaders(res: any, maxAge: number) {
  res.set("Cache-Control", `public, max-age=${maxAge}`);
  res.set("Expires", new Date(Date.now() + maxAge * 1000).toUTCString());
}

export async function proxyAnimeApi(endpoint: string) {
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
