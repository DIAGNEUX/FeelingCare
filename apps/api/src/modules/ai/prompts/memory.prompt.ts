export function buildMemoryPrompt(
  memory: string | null,
  messages: { role: 'user' | 'assistant'; content: string }[],
): string {
  const formattedMessages = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n');

  return `
Voici la mémoire actuelle de l'utilisateur :
${memory ?? 'Aucune mémoire existante.'}

Voici les nouveaux messages :
${formattedMessages}

Mets à jour la mémoire utilisateur en 1 ou 2 phrases maximum.

Règles :
- Concentre-toi sur les émotions importantes
- Identifie les situations récurrentes (travail, solitude, fatigue, relations...)
- Ignore les informations peu importantes ou ponctuelles
- Conserve les éléments importants déjà présents si ils sont toujours pertinents
- Garde uniquement ce qui est utile dans le temps
- Ne fais pas de diagnostic
- Garde un style clair, stable et synthétique
`;
}
