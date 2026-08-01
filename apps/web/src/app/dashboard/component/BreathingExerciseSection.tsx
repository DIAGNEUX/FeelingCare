import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BreathingExerciseSection() {
  const router = useRouter();

  return (
    <section className="rounded-[1.75rem] bg-white p-5 text-feelingcare-light-text dark:bg-feelingcare-dark-bg-secondary dark:text-feelingcare-dark-text">
      <h2 className="text-base font-bold">Prendre un moment pour toi</h2>

      <div className="relative mx-auto mt-5 h-44 w-full max-w-56">
        <Image
          src="/meditation.png"
          alt="Moment de respiration"
          fill
          className="object-contain"
          sizes="224px"
          priority
        />
        <button
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-feelingcare-light-text shadow-sm transition hover:scale-105 dark:bg-feelingcare-dark-bg/90 dark:text-feelingcare-dark-text"
          type="button"
          aria-label="Lancer l'exercice"
          onClick={() => router.push("/dashboard/exercise")}
        >
          <Play className="ml-1 h-6 w-6 fill-current" />
        </button>
      </div>

      <p className="mt-5 text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
        Tu peux essayer un exercice de respiration si cela peut t&apos;aider.
      </p>

      <button
        className="mt-3 rounded-full bg-feelingcare-primary px-4 py-2 text-sm font-bold text-feelingcare-light-text transition hover:bg-feelingcare-primary/90"
        type="button"
        onClick={() => router.push("/dashboard/exercise")}
      >
        Commencer l&apos;exercice
      </button>
    </section>
  );
}
