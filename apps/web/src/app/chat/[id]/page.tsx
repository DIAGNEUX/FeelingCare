import { getConversation } from "@/lib/api";
import MessageComposer from "../component/MessageComposer";
import MessageList from "../component/MessageList";
import Sidebar from "../component/Sidebar";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const conversation = await getConversation(id);

  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_center,_#101519_12%,_#101316_36%,_#0F1115_96%)]">
      <Sidebar activeId={id} />
      <main className="flex-1 flex flex-col p-6 max-w-2xl mx-auto h-screen">
        <header className="mb-6 shrink-0 text-amber-50">
          <h1 className="text-xl font-semibold">{conversation.title}</h1>
          <p className="text-sm opacity-60">
            {conversation.emotion ? `Émotion: ${conversation.emotion.name}` : "Sans émotion"}
          </p>
        </header>

        {/* MessageList gère le scroll */}
        <MessageList messages={conversation.messages} conversationId={conversation.id} />


        {/* Input fixé en bas */}
        <div className="shrink-0">
          <MessageComposer conversationId={conversation.id} />
        </div>
      </main>
    </div>
  );
}