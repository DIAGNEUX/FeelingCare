export type ExerciseCategory =
  | "stress"
  | "fatigue"
  | "calm"
  | "lifestyle"
  | "emotion";

export type RecommendedExercise = {
  id: string;
  category: ExerciseCategory;
  title: string;
  subtitle: string;
  duration: number;
  steps: string[];
  accent: string;
  tone: string;
};

export const EXERCISE_MAP: Record<ExerciseCategory, RecommendedExercise> = {
  stress: {
    id: "breathing-4-7-8",
    category: "stress",
    title: "Respiration 4-7-8",
    subtitle: "Une technique calme et simple pour relâcher la tension.",
    duration: 120,
    steps: [
      "Inspire lentement pendant 4 secondes.",
      "Retient l'air pendant 7 secondes.",
      "Expire doucement pendant 8 secondes.",
    ],
    accent: "bg-feelingcare-primary/10 text-feelingcare-primary",
    tone: "Un exercice apaisant pour ralentir ton rythme.",
  },
  fatigue: {
    id: "meditation-guided",
    category: "fatigue",
    title: "Méditation guidée courte",
    subtitle: "Un moment pour reprendre contact avec ton corps.",
    duration: 300,
    steps: [
      "Assieds-toi confortablement et ferme les yeux.",
      "Suis ton souffle sans le forcer.",
      "Observe les sensations sans les juger.",
    ],
    accent: "bg-feelingcare-secondary/10 text-feelingcare-secondary",
    tone: "Un espace calme pour recentrer ton énergie.",
  },
  calm: {
    id: "stretching-gentle",
    category: "calm",
    title: "Étirements doux",
    subtitle: "Relâche les zones tendues sans forcer.",
    duration: 480,
    steps: [
      "Étire lentement les épaules et le cou.",
      "Respire profondément à chaque mouvement.",
      "Reste à l'écoute de ton corps.",
    ],
    accent: "bg-feelingcare-accent/10 text-feelingcare-accent",
    tone: "Un moment doux pour détendre ton corps.",
  },
  lifestyle: {
    id: "breathing-box",
    category: "lifestyle",
    title: "Respiration conscience",
    subtitle: "Une pause simple pour retrouver de la clarté.",
    duration: 180,
    steps: [
      "Inspire 4 secondes en comptant lentement.",
      "Retient 4 secondes sans tension.",
      "Expire 4 secondes en relâchant.",
    ],
    accent: "bg-feelingcare-indigo/10 text-feelingcare-indigo",
    tone: "Un rituel court pour te recentrer rapidement.",
  },
  emotion: {
    id: "meditation-emotion",
    category: "emotion",
    title: "Méditation d'accueil des émotions",
    subtitle: "Accueille ce que tu ressens sans pression.",
    duration: 360,
    steps: [
      "Observe l'émotion qui est présente.",
      "Respire sans chercher à la changer.",
      "Laisse-la exister en douceur.",
    ],
    accent: "bg-feelingcare-cool/10 text-feelingcare-cool",
    tone: "Un exercice bienveillant pour apaiser ton état intérieur.",
  },
};

export function getRecommendedExercise(insights: { category: string }[]) {
  const category = insights?.[0]?.category as ExerciseCategory | undefined;

  if (category && EXERCISE_MAP[category]) {
    return EXERCISE_MAP[category];
  }

  return EXERCISE_MAP.stress;
}
