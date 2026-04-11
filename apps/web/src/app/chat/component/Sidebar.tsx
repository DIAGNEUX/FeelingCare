"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { listConversations } from "@/lib/api";
import NewConversationButton from "./Buttons/NewConversationButton";
import DeleteConversationButton from "./Buttons/DeleteConversationButton";
import RenameConversationButton from "./Buttons/RenameConversationButton";

import type { Emotion } from "@/lib/types";
import { Pencil } from "lucide-react";

function formatEmotion(emotion: Emotion | null) {
  return emotion ? emotion.name : "—";
}

export default function Sidebar({ activeId }: { activeId: string }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  

  useEffect(() => {
  listConversations().then(setConversations);
}, []);

  return (
    <aside className="w-70 shrink-0 h-screen flex flex-col bg-white/[0.02] backdrop-blur-xl border-r border-white/10">
      
      {/* HEADER */}
      <div className="p-4 space-y-3">
        <div>
          <div className="text-sm font-semibold text-white/90">
            FeelingCare
          </div>
          <p className="text-xs text-white/60">
            Espace d'écoute bienveillant
          </p>
        </div>

        <div className="space-y-2 text-amber-50">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-sm hover:bg-white/5"
          >
            Choisir une émotion
          </Link>

          <NewConversationButton />
        </div>

        <div className="text-xs text-white/50">Historique</div>
      </div>

      {/* LISTE */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {conversations.map((c) => {
          const active = c.id === activeId;

          return (
            <div
              key={c.id}
              onClick={() => router.push(`/chat/${c.id}`)}
              className={`group cursor-pointer relative flex items-center rounded-md  text-amber-50 ${
                active
                  ? "border-white/20 bg-white/5"
                  : "border-white/10 hover:bg-white/5"
              }`}
            >
              {/* CONTENU */}
              <div className="flex-1 min-w-0 flex flex-col gap-0.5 p-2">
                <RenameConversationButton
                  conversationId={c.id}
                  currentTitle={c.title}
                  forceEditing={editingId === c.id}
                  onDone={() => setEditingId(null)}
                  onRenameSuccess={(newTitle) => {
                    setConversations((prev) =>
                      prev.map((conv) =>
                        conv.id === c.id ? { ...conv, title: newTitle } : conv
                      )
                    );
                  }}
                />

                
              </div>

              {/* MENU ⋯ */}
              <div
                className={`transition-opacity pr-2 shrink-0 ${
                  openMenuId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === c.id ? null : c.id);
                    }}
                  >
                    ⋯
                  </button>

                  {/* MENU SIMPLE */}
                  {openMenuId === c.id && (
                    <div className="absolute right-0 top-6 mt-1 w-32 rounded-md bg-[#15191D]  shadow-lg z-90">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(c.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left flex items-center px-3 py-2 text-sm text-white/60 hover:text-white"
                      >
                       <Pencil className="w-4 h-4 mr-2" /> Renommer
                      </button>

                      <div className="px-2 py-1">
                        <DeleteConversationButton
                          conversationId={c.id}
                          isActive={active}
                          onDeleteSuccess={() => {
                            setConversations((prev) =>
                              prev.filter((conv) => conv.id !== c.id)
                            );
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link
          href="/login"
          className="flex items-center justify-start gap-2 w-full rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5 transition"
        >
          Se connecter
        </Link>
      </div>

    </aside>
  );
}