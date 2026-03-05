import { getConversation } from "@/lib/api";
import MessageComposer from "./MessageComposer";
import Sidebar from "./Sidebar";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params; 

  const conversation = await getConversation(id);

  return (
    <div className="min-h-screen flex">
    <Sidebar activeId={id} />
    <main className="flex-1 p-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">{conversation.title}</h1>
        <p className="text-sm opacity-60">
          {conversation.emotion ? `Émotion: ${conversation.emotion}` : "Sans émotion"}
        </p>
      </header>
      <section className="space-y-4">
      {conversation.messages.map((m) => {
        const isUser = m.role === "USER";

        return (
          <div
            key={m.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                isUser
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-white"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        );
      })}
    </section>
      <MessageComposer conversationId={conversation.id} />

    </main>
    </div>
  );
}
