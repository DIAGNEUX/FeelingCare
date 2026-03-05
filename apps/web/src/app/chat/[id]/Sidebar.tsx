import Link from "next/link";
import { listConversations } from "@/lib/api";
import NewConversationButton from "./NewConversationButton";

function formatEmotion(emotion: string | null) {
  return emotion ? emotion : "—";
}

export default async function Sidebar({ activeId }: { activeId: string }) {
  const conversations = await listConversations();

  return (
    <aside className="w-80 shrink-0 border-r border-white/10 h-screen flex flex-col">
      {/* Zone fixe (header + actions) */}
      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm font-semibold text-white/90">FeelingCare</div>
          <p className="text-xs text-white/60">Espace d’écoute bienveillant</p>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            className="block rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
          >
            Choisir une émotion
          </Link>

          <NewConversationButton />
        </div>

        <div className="text-xs text-white/50">Historique</div>
      </div>

      {/* Zone scrollable (liste) */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-soft">
        {conversations.map((c) => {
          const active = c.id === activeId;
          return (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              className={`block rounded-xl px-3 py-2 text-sm border ${
                active
                  ? "border-white/20 bg-white/5"
                  : "border-white/10 hover:bg-white/5"
              }`}
            >
              <div className="truncate">{c.title}</div>
              <div className="text-xs text-white/50">{formatEmotion(c.emotion)}</div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
