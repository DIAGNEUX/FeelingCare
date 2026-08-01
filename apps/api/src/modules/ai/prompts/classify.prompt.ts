export function buildClassificationPrompt(message: string): string {
  return `
Analyse le message utilisateur et retourne strictement un JSON valide.

Format attendu :
{
  "riskLevel": "low | medium | high",
  "intent": "venting | seeking_help | crisis",
  "emotions": ["emotion1", "emotion2"]
}

Regles :
- "high" : idees suicidaires, intention de se faire du mal, danger immediat, detresse extreme
- "medium" : souffrance emotionnelle forte, anxiete intense, epuisement, isolement
- "low" : message neutre, leger ou expression emotionnelle sans danger apparent
- "crisis" : danger immediat, idees de mort, passage a l'acte, peur de ne pas tenir
- "seeking_help" : demande d'aide, conseil ou solution
- "venting" : expression emotionnelle ou besoin de parler

Important :
- Reponds uniquement avec du JSON
- Ne donne aucune explication

Message :
${JSON.stringify(message)}
`;
}
