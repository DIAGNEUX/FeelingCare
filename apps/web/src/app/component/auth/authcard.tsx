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
    <div
      className="
        w-full max-w-md p-8 rounded-2xl
        bg-[#0F1115]/90 backdrop-blur-md
        shadow-2xl 
      "
    >
      <h1 className="text-white text-lg font-semibold mb-1">
        {title}
      </h1>
      <p className="text-gray-400 text-sm mb-6">{subtitle}</p>

      <div className="space-y-4">{children}</div>

      <div className="mt-6 text-center text-sm text-gray-400">
        {footer}
      </div>
    </div>
  );
}