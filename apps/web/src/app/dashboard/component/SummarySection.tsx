type Props = {
  summary: string;
  loading: boolean;
};

export default function SummarySection({ summary, loading }: Props) {
  return (
    <section className="rounded-[1.75rem] bg-white p-7 dark:bg-feelingcare-dark-bg-secondary">
      <p className="max-w-3xl text-lg leading-8 text-feelingcare-light-text dark:text-feelingcare-dark-text">
        {loading
          ? "Lecture de tes derniers échanges..."
          : summary ||
            "Commence une conversation pour voir ici une reformulation douce de ce que tu as exprimé."}
      </p>
    </section>
  );
}
