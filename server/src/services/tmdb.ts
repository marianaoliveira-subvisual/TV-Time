import { MOCK_SHOWS } from "../mockData";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export interface NormalizedEpisode {
  tmdbId: number | null;
  episodeNumber: number;
  name: string;
  overview: string | null;
  airDate: string | null;
  stillPath: string | null;
  runtime: number | null;
}

export interface NormalizedSeason {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterPath: string | null;
  episodes: NormalizedEpisode[];
}

export interface NormalizedShowSummary {
  tmdbId: number;
  name: string;
  overview: string;
  posterPath: string | null;
  firstAirDate: string | null;
}

export interface NormalizedShow extends NormalizedShowSummary {
  backdropPath: string | null;
  status: string | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  seasons: NormalizedSeason[];
}

function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY);
}

export function usingMockData(): boolean {
  return !isTmdbConfigured();
}

function posterUrl(path: string | null): string | null {
  return path ? `${IMAGE_BASE}${path}` : null;
}

async function tmdbFetch(path: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY as string);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function searchShows(query: string): Promise<NormalizedShowSummary[]> {
  if (!isTmdbConfigured()) {
    const q = query.trim().toLowerCase();
    return MOCK_SHOWS.filter((s) => s.name.toLowerCase().includes(q)).map((s) => ({
      tmdbId: s.tmdbId,
      name: s.name,
      overview: s.overview,
      posterPath: s.posterPath,
      firstAirDate: s.firstAirDate,
    }));
  }

  const data = await tmdbFetch("/search/tv", { query, include_adult: "false" });
  return (data.results || []).map((r: any) => ({
    tmdbId: r.id,
    name: r.name,
    overview: r.overview,
    posterPath: posterUrl(r.poster_path),
    firstAirDate: r.first_air_date || null,
  }));
}

export async function listPopularShows(): Promise<NormalizedShowSummary[]> {
  if (!isTmdbConfigured()) {
    return MOCK_SHOWS.map((s) => ({
      tmdbId: s.tmdbId,
      name: s.name,
      overview: s.overview,
      posterPath: s.posterPath,
      firstAirDate: s.firstAirDate,
    }));
  }

  const data = await tmdbFetch("/tv/popular");
  return (data.results || []).map((r: any) => ({
    tmdbId: r.id,
    name: r.name,
    overview: r.overview,
    posterPath: posterUrl(r.poster_path),
    firstAirDate: r.first_air_date || null,
  }));
}

export async function getShowDetails(tmdbId: number): Promise<NormalizedShow | null> {
  if (!isTmdbConfigured()) {
    return MOCK_SHOWS.find((s) => s.tmdbId === tmdbId) || null;
  }

  const show = await tmdbFetch(`/tv/${tmdbId}`);
  if (!show || show.success === false) return null;

  const seasons: NormalizedSeason[] = [];
  for (const s of show.seasons || []) {
    if (s.season_number === 0) continue; // skip "specials"
    const seasonData = await tmdbFetch(`/tv/${tmdbId}/season/${s.season_number}`);
    seasons.push({
      seasonNumber: s.season_number,
      name: seasonData.name || `Season ${s.season_number}`,
      episodeCount: (seasonData.episodes || []).length,
      posterPath: posterUrl(s.poster_path),
      episodes: (seasonData.episodes || []).map((e: any) => ({
        tmdbId: e.id,
        episodeNumber: e.episode_number,
        name: e.name,
        overview: e.overview || null,
        airDate: e.air_date || null,
        stillPath: posterUrl(e.still_path),
        runtime: e.runtime || null,
      })),
    });
  }

  return {
    tmdbId: show.id,
    name: show.name,
    overview: show.overview,
    posterPath: posterUrl(show.poster_path),
    backdropPath: posterUrl(show.backdrop_path),
    firstAirDate: show.first_air_date || null,
    status: show.status || null,
    numberOfSeasons: show.number_of_seasons || seasons.length,
    numberOfEpisodes: show.number_of_episodes || seasons.reduce((n, s) => n + s.episodes.length, 0),
    seasons,
  };
}
