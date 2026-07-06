import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUpcoming } from "../api/stats";
import type { UpcomingEpisode } from "../api/types";
import { Poster } from "../components/Poster";

function formatDate(iso: string) {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function CalendarPage() {
  const [upcoming, setUpcoming] = useState<UpcomingEpisode[] | null>(null);

  useEffect(() => {
    getUpcoming().then((res) => setUpcoming(res.upcoming));
  }, []);

  if (!upcoming) return <p className="text-slate-500 text-sm">Loading…</p>;

  const groups = new Map<string, UpcomingEpisode[]>();
  for (const ep of upcoming) {
    if (!ep.airDate) continue;
    if (!groups.has(ep.airDate)) groups.set(ep.airDate, []);
    groups.get(ep.airDate)!.push(ep);
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Upcoming</h1>
      <p className="text-slate-400 text-sm mb-6">New episodes from shows you're tracking.</p>

      {groups.size === 0 ? (
        <p className="text-slate-500 text-sm">
          No upcoming episodes.{" "}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Add shows to your library
          </Link>{" "}
          to see them here.
        </p>
      ) : (
        <div className="space-y-6">
          {[...groups.entries()].map(([date, episodes]) => (
            <div key={date}>
              <h2 className="text-sm font-semibold text-slate-400 mb-2">{formatDate(date)}</h2>
              <div className="space-y-2">
                {episodes.map((ep) => (
                  <Link
                    key={ep.episodeId}
                    to={`/shows/${ep.showTmdbId}`}
                    className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-indigo-500 transition"
                  >
                    <Poster
                      name={ep.showName}
                      posterPath={ep.showPosterPath}
                      className="w-10 aspect-[2/3] rounded-md shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{ep.showName}</p>
                      <p className="text-xs text-slate-500">
                        S{ep.seasonNumber} E{ep.episodeNumber} · {ep.episodeName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
