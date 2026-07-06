import { useEffect, useState } from "react";
import { getStats } from "../api/stats";
import type { Stats } from "../api/types";
import { useAuth } from "../context/AuthContext";

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-stone-900/10 rounded-xl p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-sage-dark">{value}</p>
      <p className="text-xs text-stone-500 mt-1">{label}</p>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-peach to-rose flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user?.displayName?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-stone-800">{user?.displayName}</h1>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Episodes Watched" value={stats.episodesWatched} />
          <StatTile label="Hours Watched" value={stats.hoursWatched} />
          <StatTile label="Shows Tracked" value={stats.showsInLibrary} />
          <StatTile label="Shows Completed" value={stats.showsCompleted} />
        </div>
      )}
    </div>
  );
}
