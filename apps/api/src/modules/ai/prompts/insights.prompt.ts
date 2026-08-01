export function buildInsightsPrompt(input: {
  emotions: string[];
  dominantEmotion: string;
  themes: string[];
  recentSignals: string[];
  memory: string | null;
}) {
  return `
Tu identifies des patterns emotionnels utiles pour un dashboard personnel.

Donnees :
- Emotions : ${input.emotions.join(', ') || 'aucune'}
- Emotion dominante : ${input.dominantEmotion}
- Themes : ${input.themes.join(', ') || 'aucun'}
- Signaux recents :
${input.recentSignals.map((signal) => `- ${signal}`).join('\n') || '- aucun'}
- Memoire : ${input.memory || 'aucune'}

Tache :
Genere 2 a 3 insights courts et utiles.

Format JSON strict :
[
  {
    "category": "stress | fatigue | calm | lifestyle | emotion",
    "label": "phrase courte naturelle",
    "detail": "petit contexte utile"
  }
]

Contraintes :
- pas de texte hors JSON
- category doit etre strictement parmi stress, fatigue, calm, lifestyle, emotion
- label doit etre court et naturel
- detail doit faire une seule phrase courte, maximum 12 mots
- ne pas inventer
- ne pas diagnostiquer
- ne pas donner de conseil medical
- rester simple, humain et descriptif
`;
}
