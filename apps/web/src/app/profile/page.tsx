"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  HeartPulse,
  KeyRound,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import AccountMenu from "@/app/component/auth/AccountMenu";
import { useAuth } from "@/app/component/auth/AuthProvider";
import { ThemeToggle } from "@/app/component/ui/theme-toggle";
import {
  changePassword,
  updateCurrentUser,
} from "@/lib/api/auth.api";

function formatDate(value: string) {
  if (!value) return "date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, setCurrentUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName?.trim() ?? "");
      setLastName(user.lastName?.trim() ?? "");
    }
  }, [user]);

  async function handleUpdateProfile() {
    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("Indique ton prenom et ton nom.");
      setProfileMessage("");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileMessage("");
      setProfileError("");

      const updatedUser = await updateCurrentUser({
        firstName,
        lastName,
      });

      setCurrentUser(updatedUser);
      setProfileMessage("Profil mis a jour.");
    } catch (error) {
      console.error(error);
      setProfileError("Impossible de mettre a jour le profil.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword.trim()) {
      setPasswordError("Indique ton mot de passe actuel.");
      setPasswordMessage("");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caracteres.");
      setPasswordMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      setPasswordMessage("");
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordMessage("");
      setPasswordError("");

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Mot de passe mis a jour.");
    } catch (error) {
      console.error(error);
      setPasswordError("Impossible de modifier le mot de passe.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
        <div className="flex items-center gap-3 rounded-full border border-feelingcare-light-border bg-white px-5 py-3 text-sm font-bold shadow-sm dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
          <HeartPulse className="h-4 w-4 animate-pulse text-feelingcare-primary" />
          Chargement...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-feelingcare-light-bg px-4 text-feelingcare-light-text dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
        <div className="w-full max-w-md rounded-[2rem] border border-feelingcare-light-border bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,23,23,0.06)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-feelingcare-primary text-feelingcare-light-text">
            <UserRound className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-bold">Connexion requise</h1>
          <p className="mt-3 text-sm leading-6 text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
            Connecte-toi pour accéder à ton profil FeelingCare.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-feelingcare-light-text px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 dark:bg-feelingcare-dark-text dark:text-feelingcare-dark-bg"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  const fullName = [user.firstName, user.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const accountLabel = fullName || user.email?.trim() || "Compte FeelingCare";
  const accountEmail = user.email?.trim() || "Email non renseigné";
  const createdAtLabel = formatDate(user.createdAt);
  const initial = accountLabel.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-feelingcare-light-bg text-feelingcare-light-text transition-colors duration-300 dark:bg-feelingcare-dark-bg dark:text-feelingcare-dark-text">
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-feelingcare-primary text-feelingcare-light-text shadow-[0_14px_35px_rgba(221,242,65,0.35)]">
                <HeartPulse className="h-6 w-6" />
              </span>
              <span className="text-xl font-bold">FeelingCare</span>
            </Link>

            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <AccountMenu />
            </div>
          </header>

          <section className="mt-10 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                Ton compte
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Profil
              </h1>
            </div>

            <div>
              <section className="rounded-[2rem] border border-feelingcare-light-border bg-white p-6 shadow-[0_18px_45px_rgba(23,23,23,0.06)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.75rem] bg-feelingcare-primary text-3xl font-bold text-feelingcare-light-text">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-bold">{accountLabel}</h2>
                    <p className="mt-2 text-sm text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Membre depuis le {createdAtLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[1.5rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg">
                    <UserRound className="h-5 w-5 text-feelingcare-primary" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Prénom
                    </p>
                    <p className="mt-2 truncate text-sm font-bold">
                      {user.firstName || "Non renseigné"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg">
                    <UserRound className="h-5 w-5 text-feelingcare-primary" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Nom
                    </p>
                    <p className="mt-2 truncate text-sm font-bold">
                      {user.lastName || "Non renseigné"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg">
                    <Mail className="h-5 w-5 text-feelingcare-primary" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Email
                    </p>
                    <p className="mt-2 truncate text-sm font-bold">{accountEmail}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-feelingcare-light-border bg-feelingcare-light-bg p-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg">
                    <CalendarDays className="h-5 w-5 text-feelingcare-primary" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Création
                    </p>
                    <p className="mt-2 text-sm font-bold">
                      {createdAtLabel}
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-5 rounded-[2rem] border border-feelingcare-light-border bg-white p-6 shadow-[0_18px_45px_rgba(23,23,23,0.06)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-feelingcare-primary/15 text-feelingcare-primary">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold">Identité</h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Prénom
                    </span>
                    <input
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
                      disabled={profileSaving}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Nom
                    </span>
                    <input
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
                      disabled={profileSaving}
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`text-sm font-semibold ${
                      profileError
                        ? "text-red-600 dark:text-red-300"
                        : "text-feelingcare-accent-emerald"
                    }`}
                  >
                    {profileError || profileMessage}
                  </p>
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    disabled={profileSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-feelingcare-primary px-5 py-3 text-sm font-bold text-feelingcare-light-text transition hover:bg-feelingcare-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {profileSaving ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </section>

              <section className="mt-5 rounded-[2rem] border border-feelingcare-light-border bg-white p-6 shadow-[0_18px_45px_rgba(23,23,23,0.06)] dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-feelingcare-primary/15 text-feelingcare-primary">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold">Mot de passe</h2>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Mot de passe actuel
                    </span>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
                      disabled={passwordSaving}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Nouveau mot de passe
                    </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
                      disabled={passwordSaving}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                      Confirmation
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-2xl border border-feelingcare-light-border bg-feelingcare-light-bg/70 px-4 py-3.5 text-sm text-feelingcare-light-text transition-all duration-200 focus:border-feelingcare-primary focus:outline-none focus:ring-4 focus:ring-feelingcare-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg/50 dark:text-feelingcare-dark-text dark:focus:border-feelingcare-primary-dark dark:focus:ring-feelingcare-primary-dark/20"
                      disabled={passwordSaving}
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    className={`text-sm font-semibold ${
                      passwordError
                        ? "text-red-600 dark:text-red-300"
                        : "text-feelingcare-accent-emerald"
                    }`}
                  >
                    {passwordError || passwordMessage}
                  </p>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={passwordSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-feelingcare-primary px-5 py-3 text-sm font-bold text-feelingcare-light-text transition hover:bg-feelingcare-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    {passwordSaving ? "Modification..." : "Modifier"}
                  </button>
                </div>
              </section>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
