import { apiFetch } from "./client";
import type { Stats, UpcomingEpisode } from "./types";

export function getStats() {
  return apiFetch<Stats>("/stats");
}

export function getUpcoming() {
  return apiFetch<{ upcoming: UpcomingEpisode[] }>("/stats/calendar");
}
