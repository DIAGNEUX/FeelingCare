export function buildTitlePrompt(messages: any[]): string {
  return `Tu es un assistant qui génère des titres courts pour des conversations émotionnelles.

Règles :
- Maximum 5 mots
- Pas de guillemets
- Pas de ponctuation à la fin
- En français
- Reflète le sujet principal de la conversation

Exemples :
- Fatigue au travail
- Relation difficile avec mon père
- Stress avant les examens

Conversation :
${messages
  .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`)
  .join('\n')}

Génère un titre court.`;
}