"use client";

import {
  BriefcaseBusiness,
  Leaf,
  Moon,
  Sprout,
  Waves,
  type LucideIcon,
} from "lucide-react";

type CategoryConfig = {
  icon: LucideIcon;
  className: string;
};

type Props = {
  data: {
    category: string;
    label: string;
    detail: string;
  }[];
  loading: boolean;
};

const defaultCategoryConfig: CategoryConfig = {
  icon: Waves,
  className: "bg-feelingcare-accent-blue-light",
};

const categoryMap: Record<string, CategoryConfig> = {
  stress: {
    icon: BriefcaseBusiness,
    className: "bg-feelingcare-accent-orange-light",
  },
  fatigue: {
    icon: Moon,
    className: "bg-feelingcare-accent-rose-light",
  },
  calm: {
    icon: Leaf,
    className: "bg-feelingcare-accent-emerald-light",
  },
  lifestyle: {
    icon: Sprout,
    className: "bg-feelingcare-accent-blue-light",
  },
  emotion: {
    icon: Waves,
    className: "bg-feelingcare-primary/15 dark:bg-feelingcare-primary-dark/10",
  },
};

export default function ExpressedSignalsSection({ data, loading }: Props) {
  const visibleSignals = data?.slice(0, 3) ?? [];

  return (
    <section>
      <h2 className="text-xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
        Ce que tu as exprimé
      </h2>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {loading &&
          [0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-20 rounded-2xl bg-white/70 dark:bg-feelingcare-dark-bg-secondary"
            />
          ))}

        {!loading && visibleSignals.length === 0 && (
          <article className="rounded-2xl bg-white p-5 text-sm leading-6 text-feelingcare-light-text-secondary dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text-secondary md:col-span-3">
            Pas assez de donnees pour le moment.
          </article>
        )}

        {!loading &&
          visibleSignals.map((signal) => {
            const config = categoryMap[signal.category] || defaultCategoryConfig;
            const Icon = config.icon;

            return (
              <article
                key={signal.label}
                className={`min-h-20 rounded-2xl p-4 text-feelingcare-light-text ${config.className}`}
              >
                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold leading-5">{signal.label}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-feelingcare-light-text/70">
                  {signal.detail}
                </p>
              </article>
            );
          })}
      </div>
    </section>
  );
}
