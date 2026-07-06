import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchIcon, BookmarkIcon, CalendarIcon, UserIcon, LogoutIcon } from "./icons";

const navItems = [
  { to: "/", label: "Discover", end: true, Icon: SearchIcon },
  { to: "/library", label: "My Shows", Icon: BookmarkIcon },
  { to: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { to: "/profile", label: "Profile", Icon: UserIcon },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen bg-neutral-200 sm:py-6 sm:flex sm:justify-center">
      <div className="w-full h-full sm:max-w-[430px] sm:h-[calc(100vh-3rem)] sm:rounded-[2.25rem] sm:shadow-2xl sm:border-8 sm:border-stone-900 bg-cream flex flex-col overflow-hidden relative">
        <header className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="font-bold text-lg tracking-tight text-sage-dark">TV Time</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 max-w-[7rem] truncate">
              {user?.displayName}
            </span>
            <button
              onClick={logout}
              aria-label="Log out"
              className="w-8 h-8 rounded-full bg-white/70 text-stone-500 hover:text-stone-800 flex items-center justify-center transition"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 pb-4">
          <Outlet />
        </main>

        <nav className="shrink-0 border-t border-stone-900/10 bg-cream/95 backdrop-blur px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-medium transition ${
                  isActive ? "text-sage-dark" : "text-stone-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? "text-sage-dark" : "text-stone-400"}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
