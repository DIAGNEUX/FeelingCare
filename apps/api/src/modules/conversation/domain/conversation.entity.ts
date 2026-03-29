export class Conversation {
  constructor(
    public id: string,
    public emotionName?: string | null,
  ) {}

  /**
   * Génère le message d'ouverture en fonction de l'émotion
   */
  getOpeningMessage(): string {
    const e = (this.emotionName ?? '').trim().toLowerCase();

    if (e === 'triste') {
      return "Je suis là avec toi. Qu'est-ce qui te rend triste en ce moment ?";
    }

    if (e === 'stressé' || e === 'stresse' || e === 'stress') {
      return "Je t'écoute. Qu'est-ce qui te met sous pression en ce moment ?";
    }

    if (e === 'confus') {
      return "D'accord. Qu'est-ce qui te semble le plus flou ou difficile à comprendre en ce moment ?";
    }

    if (e === 'fatigué' || e === 'fatigue') {
      return "Je comprends. Cette fatigue, tu la ressens plutôt dans le corps, dans la tête, ou les deux ?";
    }

    if (e === 'en colère' || e === 'colère' || e === 'colere') {
      return "Je t'entends. Qu'est-ce qui a déclenché cette colère, là, maintenant ?";
    }

    return 'Bonjour. Comment tu te sens en ce moment ?';
  }

  /**
   * Règle métier : générer un titre au 3ème message utilisateur
   */
  shouldGenerateTitle(userMessageCount: number): boolean {
    return userMessageCount === 3;
  }
}