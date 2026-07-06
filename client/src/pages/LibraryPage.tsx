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

  if (!library) return <p className="text-stone-400 text-sm">Loading…</p>;

  const filtered = filter === "all" ? library : library.filter((l) => l.status === filter);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1 text-stone-800">My Shows</h1>
      <p className="text-stone-500 text-sm mb-4">Everything you're tracking.</p>

      <div className="flex gap-1 mb-5 overflow-x-auto">
        {(["all", "watching", "completed", "planned", "dropped"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === f ? "bg-sage text-white" : "bg-white text-stone-500 border border-stone-900/10"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-stone-400 text-sm">
          Nothing here yet.{" "}
          <Link to="/" className="text-sage-dark font-medium hover:underline">
            Find something to watch
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-3 pb-2">
          {filtered.map((item) => {
            const pct = item.progress.total
              ? Math.round((item.progress.watched / item.progress.total) * 100)
              : 0;
            return (
              <div
                key={item.id}
                className="bg-white border border-stone-900/10 rounded-xl p-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Link to={`/shows/${item.show.tmdbId}`} className="shrink-0">
                    <Poster
                      name={item.show.name}
                      posterPath={item.show.posterPath}
                      className="w-14 aspect-[2/3] rounded-lg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shows/${item.show.tmdbId}`}
                      className="font-medium text-stone-800 hover:text-sage-dark truncate block"
                    >
                      {item.show.name}
                    </Link>
                    <div className="w-full h-1.5 rounded-full bg-stone-900/10 mt-2 mb-1 overflow-hidden">
                      <div
                        className="h-full bg-peach rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-stone-400">
                      {item.progress.watched}/{item.progress.total} episodes
                    </p>
                  </div>
                </div>
                <select
                  value={item.status}
                  onChange={(e) => changeStatus(item.show.id, e.target.value as LibraryStatus)}
                  className="mt-3 w-full bg-cream border border-stone-900/10 rounded-lg text-sm px-2 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-sage"
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
