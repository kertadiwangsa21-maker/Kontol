import { fetcher } from "./fetcher";
import type {
  AnimeHome,
  AnimeDetail,
  AnimeItem,
  Genre,
  SearchResult,
  EpisodeDetail,
  StreamServer,
} from "@shared/schema";

const API_BASE = "/api/anime";

export const api = {
  getHome: async (): Promise<AnimeHome> => {
    return fetcher<AnimeHome>(`${API_BASE}/home`);
  },

  getSchedule: async (): Promise<any> => {
    return fetcher(`${API_BASE}/schedule`);
  },

  getAnimeDetail: async (slug: string): Promise<AnimeDetail> => {
    return fetcher<AnimeDetail>(`${API_BASE}/${slug}`);
  },

  getCompleteAnime: async (page: number = 1): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${API_BASE}/complete-anime/${page}`);
  },

  getOngoingAnime: async (page: number = 1): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${API_BASE}/ongoing-anime?page=${page}`);
  },

  getGenres: async (): Promise<Genre[]> => {
    return fetcher<Genre[]>(`${API_BASE}/genre`);
  },

  getAnimeByGenre: async (
    slug: string,
    page: number = 1
  ): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${API_BASE}/genre/${slug}?page=${page}`);
  },

  getEpisodeDetail: async (slug: string): Promise<EpisodeDetail> => {
    return fetcher<EpisodeDetail>(`${API_BASE}/episode/${slug}`);
  },

  searchAnime: async (keyword: string): Promise<SearchResult[]> => {
    return fetcher<SearchResult[]>(`${API_BASE}/search/${keyword}`);
  },

  getBatch: async (slug: string): Promise<any> => {
    return fetcher(`${API_BASE}/batch/${slug}`);
  },

  getServerUrl: async (serverId: string): Promise<{ url: string }> => {
    return fetcher<{ url: string }>(`${API_BASE}/server`, {
      method: "POST",
      body: JSON.stringify({ serverId }),
    });
  },

  getAllAnime: async (): Promise<AnimeItem[]> => {
    return fetcher<AnimeItem[]>(`${API_BASE}/unlimited`);
  },
};

export const {
  getHome,
  getSchedule,
  getAnimeDetail,
  getCompleteAnime,
  getOngoingAnime,
  getGenres,
  getAnimeByGenre,
  getEpisodeDetail,
  searchAnime,
  getBatch,
  getServerUrl,
  getAllAnime,
} = api;

export default api;
