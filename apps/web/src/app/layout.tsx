import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "FeelingCare",
  description: "Application d'ecoute emotionnelle assistee par IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="antialiased bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
