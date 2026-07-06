import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchShows } from "../api/shows";
import type { ShowSummary } from "../api/types";
import { Poster } from "../components/Poster";

export function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShowSummary[]>([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      searchShows(query)
        .then((res) => {
          setResults(res.results);
          setUsingMockData(res.usingMockData);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Discover</h1>
      <p className="text-slate-400 text-sm mb-4">Search for shows to add to your library.</p>

      {usingMockData && (
        <div className="mb-4 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-2">
          Showing sample data — set <code className="text-amber-200">TMDB_API_KEY</code> in{" "}
          <code className="text-amber-200">server/.env</code> to pull real shows from TMDB.
        </div>
      )}

      <input
        type="search"
        placeholder="Search shows…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : results.length === 0 ? (
        <p className="text-slate-500 text-sm">No shows found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((show) => (
            <Link
              key={show.tmdbId}
              to={`/shows/${show.tmdbId}`}
              className="group block rounded-lg overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500 transition"
            >
              <Poster name={show.name} posterPath={show.posterPath} className="w-full aspect-[2/3]" />
              <div className="p-2">
                <p className="text-sm font-medium truncate group-hover:text-indigo-400">
                  {show.name}
                </p>
                <p className="text-xs text-slate-500">
                  {show.firstAirDate ? show.firstAirDate.slice(0, 4) : "TBA"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
