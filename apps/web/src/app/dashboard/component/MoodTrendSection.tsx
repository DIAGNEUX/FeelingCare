import Link from "next/link";
import { ArrowRight, MoreHorizontal } from "lucide-react";

import type { MoodTrend } from "@/lib/api/mood.api";

type Props = {
  moodTrend: MoodTrend | null;
  loading: boolean;
};

type EmotionStyle = {
  bar: string;
  chip: string;
};

const defaultEmotionStyle: EmotionStyle = {
  bar: "bg-feelingcare-primary",
  chip: "bg-feelingcare-primary/20",
};

const emotionStyles: { keywords: string[]; style: EmotionStyle }[] = [
  {
    keywords: ["stress"],
    style: {
      bar: "bg-feelingcare-accent-orange",
      chip: "bg-feelingcare-accent-orange-light",
    },
  },
  {
    keywords: ["fatigue", "colere"],
    style: {
      bar: "bg-feelingcare-accent-rose",
      chip: "bg-feelingcare-accent-rose-light",
    },
  },
  {
    keywords: ["triste"],
    style: {
      bar: "bg-feelingcare-accent-blue",
      chip: "bg-feelingcare-accent-blue-light",
    },
  },
  {
    keywords: ["confus", "calme"],
    style: {
      bar: "bg-feelingcare-accent-emerald",
      chip: "bg-feelingcare-accent-emerald-light",
    },
  },
];

function normalizeEmotionName(emotion: string | null) {
  if (!emotion) return "";

  return emotion
    .toLocaleLowerCase("fr-FR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getEmotionStyle(emotion: string | null) {
  const normalized = normalizeEmotionName(emotion);

  return (
    emotionStyles.find((entry) =>
      entry.keywords.some((keyword) => normalized.includes(keyword))
    )?.style ?? defaultEmotionStyle
  );
}

function toneForScore(score: number | null) {
  if (score === null) return "Pas encore";
  if (score < 45) return "A ecouter";
  if (score < 65) return "Variable";
  if (score < 80) return "Plus pose";

  return "Plus leger";
}

function momentLabel(count: number) {
  if (count <= 1) return "1 moment";

  return `${count} moments`;
}

function progressionLabel(progression: number | null) {
  if (progression === null) return null;
  if (progression > 8) return "Derniers jours plus legers";
  if (progression < -8) return "Derniers jours plus lourds";

  return "Rythme stable";
}

export default function MoodTrendSection({ moodTrend, loading }: Props) {
  if (loading || !moodTrend) {
    return (
      <section className="rounded-[1.75rem] bg-white p-6 dark:bg-feelingcare-dark-bg-secondary">
        <p className="text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
          Chargement de la tendance...
        </p>
      </section>
    );
  }

  const trend = moodTrend.trend;
  const daysWithData = trend.filter((item) => item.hasData).length;
  const shouldInviteCheckIn = daysWithData < 2;
  const progression = progressionLabel(moodTrend.progression);
  const dominantStyle = getEmotionStyle(moodTrend.dominantEmotion);

  return (
    <section className="rounded-[1.75rem] bg-white p-6 dark:bg-feelingcare-dark-bg-secondary">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
            Tendance des derniers jours
          </h2>
          <p className="mt-1 text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
            Une lecture indicative, sans note a atteindre.
          </p>
        </div>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-feelingcare-light-text-secondary transition hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:text-feelingcare-dark-text"
          type="button"
          aria-label="Options de tendance"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 rounded-[1.5rem] bg-feelingcare-light-bg/70 p-5 dark:bg-feelingcare-dark-bg/70">
        <div className="relative flex h-64 items-end gap-3 border-b border-feelingcare-light-border/70 pb-4 dark:border-feelingcare-dark-border">
          {daysWithData === 0 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              La tendance se construira avec tes prochains moments.
            </div>
          )}

          {trend.map((item) => {
            const style = getEmotionStyle(item.emotion);
            const height = item.score ? Math.max(item.score, 18) : 0;

            return (
              <div
                key={item.date}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                title={
                  item.hasData && item.emotion
                    ? `${item.emotion} - ${momentLabel(item.conversationCount)}`
                    : "Pas encore de moment"
                }
              >
                {item.hasData ? (
                  <div
                    className={`w-full max-w-12 rounded-t-2xl ${style.bar}`}
                    style={{ height: `${height}%` }}
                  />
                ) : (
                  <div className="h-2 w-2 rounded-full border border-dashed border-feelingcare-light-border dark:border-feelingcare-dark-border" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
          {trend.map((item) => (
            <div key={`${item.date}-label`}>
              <p>{item.day}</p>
              <p className="mt-1 hidden font-normal sm:block">
                {item.hasData ? toneForScore(item.score) : "Pas encore"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          {moodTrend.dominantEmotion ? (
            <>
              <span className="text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                Emotion souvent presente
              </span>
              <span
                className={`rounded-full px-3 py-1 font-bold text-feelingcare-light-text ${dominantStyle.chip}`}
              >
                {moodTrend.dominantEmotion}
              </span>
            </>
          ) : (
            <span className="text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              Pas assez de moments pour degager une emotion frequente.
            </span>
          )}

          {!shouldInviteCheckIn && progression && (
            <span className="rounded-full border border-feelingcare-primary/30 px-3 py-1 font-semibold text-feelingcare-light-text-secondary dark:border-feelingcare-primary-dark/30 dark:text-feelingcare-dark-text-secondary">
              {progression}
            </span>
          )}
        </div>

        {shouldInviteCheckIn && (
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-feelingcare-primary px-4 py-2 text-sm font-bold text-feelingcare-light-text transition hover:bg-feelingcare-primary/90 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg dark:hover:bg-feelingcare-primary-dark/80"
          >
            Faire un check-in aujourd&apos;hui
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </section>
  );
}
