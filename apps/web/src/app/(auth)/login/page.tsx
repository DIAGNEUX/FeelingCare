"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, HeartPulse } from "lucide-react";

import AuthCard from "@/app/component/auth/authcard";
import Input from "@/app/component/auth/input";
import { useAuth } from "@/app/component/auth/AuthProvider";
import { login } from "@/lib/api/auth.api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Indique ton email et ton mot de passe.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { accessToken } = await login(email, password);
      await signIn(accessToken);
      router.push("/");
    } catch (e) {
      console.error(e);
      setError("Connexion impossible. Verifie tes identifiants puis reessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-feelingcare-light-bg px-4 pb-8 pt-20 text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text lg:py-8">
      <Link
        href="/"
        className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 px-1 py-1 text-sm font-bold text-feelingcare-light-text-secondary transition hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:text-feelingcare-dark-text sm:left-6 lg:left-10"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;accueil
      </Link>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <Link
              href="/"
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-feelingcare-primary text-feelingcare-light-text shadow-[0_18px_45px_rgba(221,242,65,0.35)] transition hover:bg-feelingcare-primary/90"
              aria-label="Retour a l'accueil"
            >
              <HeartPulse className="h-8 w-8" />
            </Link>
            <h1 className="text-5xl font-bold leading-tight">
              Reviens dans ton espace calme.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              Un endroit clair pour poser ce que tu ressens et suivre ton
              evolution avec douceur.
            </p>

            <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-[1.75rem] bg-feelingcare-accent-rose-light p-5 text-feelingcare-light-text">
                <p className="text-sm font-semibold">Ecoute active</p>
                <p className="mt-5 text-3xl font-bold">24/7</p>
              </div>
              <div className="rounded-[1.75rem] bg-feelingcare-accent-blue-light p-5 text-feelingcare-light-text">
                <p className="text-sm font-semibold">Rythme doux</p>
                <p className="mt-5 text-3xl font-bold">1 min</p>
              </div>
            </div>
          </div>
        </section>

        <AuthCard
          title="Bienvenue"
          subtitle="Connecte-toi pour retrouver tes conversations et ton tableau de bord."
          footer={
            <>
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-semibold text-feelingcare-light-text underline decoration-feelingcare-primary decoration-2 underline-offset-4 transition hover:text-feelingcare-primary dark:text-feelingcare-dark-text dark:hover:text-feelingcare-primary-dark"
              >
                S&apos;inscrire
              </Link>
            </>
          }
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-feelingcare-primary px-5 py-3.5 text-sm font-bold text-feelingcare-light-text shadow-[0_16px_35px_rgba(221,242,65,0.32)] transition-all duration-200 hover:bg-feelingcare-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
            type="button"
          >
            {loading ? "Connexion..." : "Se connecter"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </AuthCard>
      </div>
    </main>
  );
}
