import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLibrary, updateLibraryStatus } from "../api/shows";
import type { LibraryItem, LibraryStatus } from "../api/types";
import { Poster } from "../components/Poster";

const STATUS_LABELS: Record<LibraryStatus, string> = {
  watching: "Watching",
  completed: "Completed",
  planned: "Planned",
  dropped: "Dropped",
};

export function LibraryPage() {
  const [library, setLibrary] = useState<LibraryItem[] | null>(null);
  const [filter, setFilter] = useState<LibraryStatus | "all">("all");

  function reload() {
    getLibrary().then((res) => setLibrary(res.library));
  }

  useEffect(() => {
    reload();
  }, []);

  async function changeStatus(showId: string, status: LibraryStatus) {
    await updateLibraryStatus(showId, status);
    reload();
  }

  if (!library) return <p className="text-slate-500 text-sm">Loading…</p>;

  const filtered = filter === "all" ? library : library.filter((l) => l.status === filter);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">My Shows</h1>
      <p className="text-slate-400 text-sm mb-4">Everything you're tracking.</p>

      <div className="flex gap-1 mb-6">
        {(["all", "watching", "completed", "planned", "dropped"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              filter === f ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-sm">
          Nothing here yet.{" "}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Find something to watch
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const pct = item.progress.total
              ? Math.round((item.progress.watched / item.progress.total) * 100)
              : 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg p-3"
              >
                <Link to={`/shows/${item.show.tmdbId}`} className="shrink-0">
                  <Poster
                    name={item.show.name}
                    posterPath={item.show.posterPath}
                    className="w-14 aspect-[2/3] rounded-md"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/shows/${item.show.tmdbId}`}
                    className="font-medium hover:text-indigo-400 truncate block"
                  >
                    {item.show.name}
                  </Link>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 mb-1 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    {item.progress.watched}/{item.progress.total} episodes
                  </p>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => changeStatus(item.show.id, e.target.value as LibraryStatus)}
                  className="bg-slate-800 border border-slate-700 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
