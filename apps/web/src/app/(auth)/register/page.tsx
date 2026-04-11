import Input from "@/app/component/auth/input";
import AuthCard from "@/app/component/auth/authcard";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_#101519_12%,_#101316_36%,_#0F1115_96%)]">
      <AuthCard
        title="INSCRIPTION"
        subtitle="Crée ton espace en toute confidentialité"
        footer={
          <>
            Déjà un compte ?{" "}
            <Link href="/login" className="text-indigo-400">
              Se connecter
            </Link>
          </>
        }
      >
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Mot de passe" />
        <Input type="password" placeholder="Mot de passe de confirmation" />

        <button
          className="
            w-full py-2 rounded-lg
            bg-gradient-to-r from-indigo-500 to-indigo-400
            text-white font-medium
            hover:opacity-90 transition
          "
        >
          S’inscrire
        </button>
      </AuthCard>
    </div>
  );
}