import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import { getStats } from "../api/stats";
import type { Stats } from "../api/types";
import { useAuth } from "../context/AuthContext";
import { TvIcon, ClockIcon, BookmarkIcon, TrophyIcon } from "../components/icons";

type IconType = ComponentType<{ className?: string }>;

function StatTile({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: string | number;
  Icon: IconType;
  color: string;
}) {
  return (
    <div className="bg-white border border-stone-900/10 rounded-2xl p-4 shadow-sm">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center mb-2 text-white"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="font-display text-2xl font-bold text-stone-800">{value}</p>
      <p className="text-xs text-stone-500 mt-0.5">{label}</p>
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
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-peach to-rose flex items-center justify-center text-2xl font-display font-bold text-white shrink-0 shadow-md shadow-rose/30">
          {user?.displayName?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-stone-800">{user?.displayName}</h1>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Episodes Watched" value={stats.episodesWatched} Icon={TvIcon} color="#788e77" />
          <StatTile label="Hours Watched" value={stats.hoursWatched} Icon={ClockIcon} color="#e0854a" />
          <StatTile label="Shows Tracked" value={stats.showsInLibrary} Icon={BookmarkIcon} color="#c96f6e" />
          <StatTile label="Shows Completed" value={stats.showsCompleted} Icon={TrophyIcon} color="#e0a94f" />
        </div>
      )}
    </div>
  );
}
