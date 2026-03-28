"use client";

import { useEffect, useState } from "react";

export default function TypingMessage({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(content.slice(0, i + 1));
      i++;
      if (i >= content.length) clearInterval(interval);
    }, 18); // vitesse en ms — ajuste selon ton goût

    return () => clearInterval(interval);
  }, [content]);

  return <div className="whitespace-pre-wrap">{displayed}</div>;
}