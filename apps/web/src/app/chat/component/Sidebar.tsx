import Link from "next/link";
import { listConversations } from "@/lib/api";
import NewConversationButton from "./Buttons/NewConversationButton";
import DeleteConversationButton from "./Buttons/DeleteConversationButton";
import RenameConversationButton from "./Buttons/RenameConversationButton";
import type { Emotion } from "@/lib/types";

function formatEmotion(emotion: Emotion | null) {
  return emotion ? emotion.name : "—";
}

export default async function Sidebar({ activeId }: { activeId: string }) {
  const conversations = await listConversations();

  return (
    <aside className="w-80 shrink-0 border-r border-white/10 h-screen flex flex-col">
      {/* Zone fixe (header + actions) */}
      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm font-semibold text-white/90">FeelingCare</div>
          <p className="text-xs text-white/60">Espace d'écoute bienveillant</p>
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
            <div
              key={c.id}
              className={`group relative flex items-center rounded-xl border ${
                active
                  ? "border-white/20 bg-white/5"
                  : "border-white/10 hover:bg-white/5"
              }`}
            >

            {/* Lien vers la conversation + renommer */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5 p-2">
                <div className="flex items-center gap-1 min-w-0">
                  <Link
                    href={`/chat/${c.id}`}
                    className="shrink-0"
                  />
                  <RenameConversationButton
                    conversationId={c.id}
                    currentTitle={c.title}
                  />
                </div>
                <div className="text-xs text-white/50 px-1">{formatEmotion(c.emotion)}</div>
              </div>
              {/* Bouton supprimer — visible au hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 shrink-0">
                <DeleteConversationButton
                  conversationId={c.id}
                  isActive={active}
                />
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}