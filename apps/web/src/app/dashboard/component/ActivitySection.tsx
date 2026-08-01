import { Clock3, MessageCircle, Moon, Sprout } from "lucide-react";

type Props = {
  activity: {
    sessionsThisWeek: number;
    totalMinutes: number;
    deepConversations: number;
    lastActiveDaysAgo: number | null;
  } | null;
  loading: boolean;
};

export default function ActivitySection({ activity, loading }: Props) {
  const rhythm =
    !activity || activity.lastActiveDaysAgo === null
      ? "Pas encore"
      : activity.lastActiveDaysAgo === 0
        ? "Aujourd'hui"
        : activity.lastActiveDaysAgo === 1
          ? "Hier"
          : `Il y a ${activity.lastActiveDaysAgo} jours`;

  const items = [
    {
      label: "Moments pour toi",
      value: `${activity?.sessionsThisWeek ?? 0} cette semaine`,
      icon: Sprout,
    },
    {
      label: "Temps pour toi",
      value: `${activity?.totalMinutes ?? 0} minutes`,
      icon: Clock3,
    },
    {
      label: "Echanges",
      value: `${activity?.deepConversations ?? 0} conversations profondes`,
      icon: MessageCircle,
    },
    {
      label: "Rythme",
      value: rhythm,
      icon: Moon,
    },
  ];

  return (
    <section className="rounded-[1.75rem] bg-white p-5 dark:bg-feelingcare-dark-bg-secondary">
      <h2 className="text-xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
        Activité
      </h2>

      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="flex items-start gap-3">
              <span className="mt-0.5 text-feelingcare-primary">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-feelingcare-light-text dark:text-feelingcare-dark-text">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                  {loading ? "..." : item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
