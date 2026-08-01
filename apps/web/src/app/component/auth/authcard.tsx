import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-feelingcare-light-border bg-white p-8 shadow-[0_24px_70px_rgba(23,23,23,0.10)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
      <div className="mb-8 inline-flex rounded-full bg-feelingcare-primary px-4 py-2 text-xs font-bold uppercase text-feelingcare-light-text">
        FeelingCare
      </div>

      <h1 className="text-3xl font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
        {title}
      </h1>
      <p className="mt-2 text-sm font-medium leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
        {subtitle}
      </p>

      <div className="mt-8 space-y-4">{children}</div>

      <div className="mt-7 text-center text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
        {footer}
      </div>
    </div>
  );
}
