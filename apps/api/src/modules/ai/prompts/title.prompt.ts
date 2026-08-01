export function buildTitlePrompt(messages: any[]): string {
  return `Tu generes des titres courts pour des conversations emotionnelles.

Regles :
- maximum 5 mots
- pas de guillemets
- pas de ponctuation finale
- en francais
- titre concret, simple et respectueux
- pas de diagnostic

Exemples :
- Fatigue au travail
- Relation difficile
- Stress avant les examens

Conversation :
${messages
  .map(
    (message) =>
      `${message.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${
        message.content
      }`,
  )
  .join('\n')}

Genere uniquement le titre.`;
}
