"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createConversation, getEmotions } from "@/lib/api";
import type { Emotion } from "@/lib/types";

const EMOTION_ICONS: Record<string, string> = {
  "Triste": "/sad.png",
  "Stressé": "/stressed.png",
  "Confus": "/confused.png",
  "Fatigué": "/tired1.png",
  "En colère": "/angry.png",
};

const Accueil = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emotions, setEmotions] = useState<Emotion[]>([]);

  useEffect(() => {
    getEmotions().then(setEmotions).catch(console.error);
  }, []);

  async function start(emotionId?: string) {
    try {
      setLoading(true);
      const convo = await createConversation(emotionId);
      router.push(`/chat/${convo.id}`);
    } catch (err) {
      console.error(err);
      alert("Impossible de démarrer la conversation. Vérifie que l'API tourne.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full bg-[radial-gradient(circle_at_center,_#101519_12%,_#101316_36%,_#0F1115_96%)] flex flex-col justify-center items-center">
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-4 justify-center items-center mb-2 ">
        {emotions.map((emotion) => (
          <button key={emotion.id} onClick={() => start(emotion.id)} disabled={loading}>
            <div className="flex flex-col items-center justify-center flex-1 px-4 py-2  rounded-xl card">
              <img
                src={EMOTION_ICONS[emotion.name] ?? "/default.png"}
                alt={emotion.name}
                width={100}
                height={100}
              />
              <p>{emotion.name}</p>
            </div>
          </button>
        ))}
        </div>
        <a onClick={() => start(undefined)} >
          <div className="flex flex-col items-center  justify-center flex-1 px-4 py-2 ">
            <p className="text-white/70 font-light">Je ne sais pas exactement</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Accueil;