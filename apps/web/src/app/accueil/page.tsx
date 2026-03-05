"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createConversation } from "@/lib/api";
const Accueil = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function start(emotion?: string) {
        try {
            setLoading(true);
            const convo = await createConversation(emotion);
            router.push(`/chat/${convo.id}`);
        } catch (err) {
            console.error(err);
            alert("Impossible de démarrer la conversation. Vérifie que l’API tourne.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <div className="flex flex-wrap gap-4 justify-center items-center">
                <button onClick={() => start("sad")}>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-2 bg-[#15191D] rounded-xl">
                    <img src="/sad.png" alt="" width={80} height={80} />
                    <p>Triste</p>
                </div>
                </button>

                <button>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-2 bg-[#15191D] rounded-xl">
                    <img src="/stressed.png" alt="" width={80} height={80}  />
                    <p>Stressé</p>
                </div>
                </button>

                <button>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-2 bg-[#15191D] rounded-xl">
                    <img src="/confused.png" alt="" width={80} height={80}  />
                    <p>Confus</p>
                </div>
                </button>

                <button>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-2 bg-[#15191D] rounded-xl">
                    <img src="/tired1.png" alt="" width={80} height={80}  />
                    <p>Fatigué</p>
                </div>
                </button>

                <button>
                <div className="flex flex-col items-center justify-center flex-1 px-4 py-2 bg-[#15191D] rounded-xl">
                    <img src="/angry.png" alt="" width={80} height={80}  />
                    <p>En colère</p>
                </div>
                </button>
            </div>

        </div>
    )
}

export default Accueil