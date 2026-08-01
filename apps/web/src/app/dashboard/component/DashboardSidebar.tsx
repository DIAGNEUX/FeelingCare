import Link from "next/link";
import {
  HeartPulse,
  Home,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

const sideLinks = [
  { label: "Accueil", icon: Home, active: false, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, active: true, href: "/dashboard" },
];

export default function DashboardSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-[13.25rem] shrink-0 flex-col border-r border-feelingcare-light-border bg-feelingcare-light-bg px-3 py-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
          <HeartPulse className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
          FeelingCare
        </span>
      </Link>

      <nav className="mt-10 space-y-2">
        {sideLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                item.active
                  ? "bg-feelingcare-primary/25 text-feelingcare-light-text dark:bg-feelingcare-primary dark:text-feelingcare-light-text dark:shadow-[0_16px_35px_rgba(221,242,65,0.18)]"
                  : "text-feelingcare-light-text-secondary hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-feelingcare-light-text-secondary transition hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text"
        >
          <UserRound className="h-4 w-4" />
          Profil
        </Link>
      </div>
    </aside>
  );
}
