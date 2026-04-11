import Input from "@/app/component/auth/input";
import AuthCard from "@/app/component/auth/authcard";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_#101519_12%,_#101316_36%,_#0F1115_96%)]">
      <AuthCard
        title="CONNEXION"
        subtitle="Content de te revoir"
        footer={
          <>
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-indigo-400">
              S'inscrire
            </Link>
          </>
        }
      >
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Mot de passe" />

        <button
          className="
            w-full py-2 rounded-lg
            bg-gradient-to-r from-indigo-500 to-indigo-400
            text-white font-medium
            hover:opacity-90 transition
          "
        >
          Se connecter
        </button>
      </AuthCard>
    </div>
  );
}