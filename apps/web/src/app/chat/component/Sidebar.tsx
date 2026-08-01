"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, LogOut, MoreHorizontal, Pencil, HeartPulse } from "lucide-react";

import { logout } from "@/lib/api/auth.api";
import { listConversations } from "@/lib/api/conversation.api";
import { ThemeToggle } from "@/app/component/ui/theme-toggle";

import NewConversationButton from "./Buttons/NewConversationButton";
import DeleteConversationButton from "./Buttons/DeleteConversationButton";
import RenameConversationButton from "./Buttons/RenameConversationButton";
import type { ConversationListItem } from "@/lib/types";

export default function Sidebar({
  activeId,
  refreshKey = 0,
  draftConversation,
  draftHref = "/chat/new",
}: {
  activeId: string;
  refreshKey?: number;
  draftConversation?: ConversationListItem;
  draftHref?: string;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("accessToken");
      router.push("/login");
    }
  };

  useEffect(() => {
    listConversations().then(setConversations).catch(console.error);
  }, [refreshKey]);

  const displayedConversations = draftConversation
    ? [
        draftConversation,
        ...conversations.filter((c) => c.id !== draftConversation.id),
      ]
    : conversations;

  return (
    <aside className="hidden h-screen w-[18rem] shrink-0 flex-col border-r border-feelingcare-light-border bg-feelingcare-light-bg px-4 py-5 dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg md:flex">
      <div className="space-y-4 border-b border-feelingcare-light-border pb-4 dark:border-feelingcare-dark-border">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-feelingcare-primary text-feelingcare-light-text">
              <HeartPulse className="h-6 w-6" />
            </span>
            <div>
              <div className="text-sm font-bold text-feelingcare-light-text dark:text-feelingcare-dark-text">
                FeelingCare
              </div>
              <p className="text-xs text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
                Espace d&apos;ecoute
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-feelingcare-light-text transition hover:bg-feelingcare-primary/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
          >
            <Home className="h-4 w-4" />
            Choisir une humeur
          </Link>

          <NewConversationButton />
        </div>

        <div className="px-1 text-xs font-semibold text-feelingcare-light-text-secondary dark:text-feelingcare-dark-text-secondary">
          Historique
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto py-4">
        {displayedConversations.map((c) => {
          const active = c.id === activeId;
          const isDraft = draftConversation?.id === c.id;

          return (
            <div
              key={c.id}
              onClick={() => router.push(isDraft ? draftHref : `/chat/${c.id}`)}
              className={`group relative flex cursor-pointer items-center rounded-2xl border text-feelingcare-light-text transition-all dark:text-feelingcare-dark-text ${
                active
                  ? "border-transparent bg-feelingcare-primary/15"
                  : "border-transparent hover:bg-feelingcare-primary/5 dark:hover:bg-feelingcare-primary-dark/5"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 p-3">
                {isDraft ? (
                  <div className="truncate text-sm font-bold">{c.title}</div>
                ) : (
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
                )}
              </div>

              {!isDraft && (
                <div
                  className={`shrink-0 pr-2 transition-opacity ${
                    openMenuId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <button
                      className="rounded-xl p-1.5 text-feelingcare-light-text-secondary transition hover:bg-white hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-dark-bg dark:hover:text-feelingcare-dark-text"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === c.id ? null : c.id);
                      }}
                      type="button"
                      aria-label="Options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === c.id && (
                      <div className="absolute right-0 top-7 z-50 mt-1 w-36 rounded-2xl border border-feelingcare-light-border bg-white p-1 shadow-lg dark:border-feelingcare-dark-border dark:bg-feelingcare-dark-bg-secondary">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(c.id);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-feelingcare-light-text transition hover:bg-feelingcare-primary/10 dark:text-feelingcare-dark-text dark:hover:bg-feelingcare-primary-dark/10"
                          type="button"
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Renommer
                        </button>

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
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-feelingcare-light-border pt-4 dark:border-feelingcare-dark-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-start gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-feelingcare-light-text-secondary transition hover:bg-feelingcare-primary/10 hover:text-feelingcare-light-text dark:text-feelingcare-dark-text-secondary dark:hover:bg-feelingcare-primary-dark/10 dark:hover:text-feelingcare-dark-text"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
