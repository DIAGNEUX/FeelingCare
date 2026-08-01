"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

import AuthCard from "@/app/component/auth/authcard";
import Input from "@/app/component/auth/input";
import { useAuth } from "@/app/component/auth/AuthProvider";
import { register } from "@/lib/api/auth.api";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError("Indique ton prenom et ton nom pour creer ton espace.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Indique ton email et ton mot de passe.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { accessToken } = await register({
        firstName,
        lastName,
        email,
        password,
      });
      await signIn(accessToken);
      router.push("/");
    } catch (e) {
      console.error(e);
      setError("Inscription impossible. Verifie tes informations puis reessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-feelingcare-light-bg px-4 py-8 text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-feelingcare-accent-rose text-feelingcare-light-text shadow-[0_18px_45px_rgba(243,182,239,0.28)]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Cree ton espace de respiration.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-8 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
              Commence par quelques mots, puis laisse FeelingCare t&apos;aider a
              clarifier ce qui compte aujourd&apos;hui.
            </p>

            <div className="mt-10 rounded-[2rem] bg-feelingcare-primary p-6 text-feelingcare-light-text">
              <p className="text-sm font-semibold">Mood check</p>
              <div className="mt-5 flex items-end gap-3">
                {[36, 58, 45, 80, 68].map((height, index) => (
                  <span
                    key={index}
                    className="w-10 rounded-t-2xl bg-white/80"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <AuthCard
          title="Inscription"
          subtitle="Un compte suffit pour garder ton historique et tes tendances."
          footer={
            <>
              Deja un compte ?{" "}
              <Link
                href="/login"
                className="font-semibold text-feelingcare-light-text underline decoration-feelingcare-primary decoration-2 underline-offset-4 transition hover:text-feelingcare-primary dark:text-feelingcare-dark-text dark:hover:text-feelingcare-primary-dark"
              >
                Se connecter
              </Link>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Prenom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
            />

            <Input
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
            />
          </div>

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

          <Input
            type="password"
            placeholder="Confirmation du mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-feelingcare-primary px-5 py-3.5 text-sm font-bold text-feelingcare-light-text shadow-[0_16px_35px_rgba(221,242,65,0.32)] transition-all duration-200 hover:bg-feelingcare-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-feelingcare-primary-dark dark:text-feelingcare-dark-bg"
            type="button"
          >
            {loading ? "Creation..." : "Creer mon espace"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </AuthCard>
      </div>
    </main>
  );
}
