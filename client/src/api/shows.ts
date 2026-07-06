import { apiFetch } from "./client";
import type { LibraryItem, LibraryStatus, ShowDetailResponse, ShowSummary } from "./types";

export function searchShows(query: string) {
  const q = query ? `?q=${encodeURIComponent(query)}` : "";
  return apiFetch<{ results: ShowSummary[]; usingMockData: boolean }>(`/shows/search${q}`);
}

export function getShow(tmdbId: number) {
  return apiFetch<ShowDetailResponse>(`/shows/${tmdbId}`);
}

export function getLibrary() {
  return apiFetch<{ library: LibraryItem[] }>("/library");
}

export function addToLibrary(tmdbId: number) {
  return apiFetch("/library", { method: "POST", body: JSON.stringify({ tmdbId }) });
}

export function removeFromLibrary(showId: string) {
  return apiFetch(`/library/${showId}`, { method: "DELETE" });
}

export function updateLibraryStatus(showId: string, status: LibraryStatus) {
  return apiFetch(`/library/${showId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function markEpisodeWatched(episodeId: string) {
  return apiFetch(`/episodes/${episodeId}/watch`, { method: "POST" });
}

export function markEpisodeUnwatched(episodeId: string) {
  return apiFetch(`/episodes/${episodeId}/watch`, { method: "DELETE" });
}
