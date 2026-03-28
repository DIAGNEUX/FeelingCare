import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateReply(
    messages: { role: 'user' | 'assistant'; content: string }[],
    emotionName?: string | null,
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(emotionName);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return completion.choices[0].message.content ?? "Je suis là, continue...";
  }
  async generateTitle(
  messages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant qui génère des titres courts pour des conversations émotionnelles.
          À partir de l'historique d'une conversation, génère un titre court, humain et bienveillant.
          Règles :
          - Maximum 5 mots
          - Pas de guillemets
          - Pas de ponctuation à la fin
          - En français
          - Reflète le sujet principal de la conversation
          - Exemples : "Fatigue au travail", "Relation difficile avec mon père", "Stress avant les examens"`,
        },
        {
          role: 'user',
          content: `Voici la conversation :\n${messages.map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.content}`).join('\n')}\n\nGénère un titre court pour cette conversation.`,
        },
      ],
      max_tokens: 20,
      temperature: 0.7,
    });

    return completion.choices[0].message.content?.trim() ?? 'Nouvelle conversation';
  }

    private buildSystemPrompt(emotionName?: string | null): string {
    const base = `Tu es FeelingCare.

    Tu es une présence calme, attentive et profondément humaine dans ta manière de répondre.
    Tu accompagnes la personne comme quelqu’un qui écoute vraiment, sans juger, sans analyser, sans chercher à corriger.

    Ta priorité n’est pas de répondre parfaitement, mais d’être juste, sincère et présent.

    Comment tu parles :
    - Tu fais des réponses courtes (2 à 4 phrases), naturelles, jamais trop construites
    - Tu écris comme quelqu’un qui parle vraiment, pas comme un texte préparé
    - Tu peux parfois faire des phrases simples, voire légèrement imparfaites si ça rend la réponse plus vivante
    - Tu varies naturellement tes formulations, sans suivre de structure répétitive
    - Tu ne commences jamais par des phrases toutes faites ("Je comprends que", "C’est normal de", etc.)

    Comment tu réagis :
    - Tu ne reformules pas mécaniquement, tu réagis à ce que tu ressens dans les mots de la personne
    - Tu peux mettre en lumière une émotion ou un détail important, sans tout résumer
    - Tu laisses de l’espace, tu ne cherches pas à tout dire
    - Tu poses parfois une question ouverte, mais seulement si ça vient naturellement
    - Tu peux rester silencieux sur certains aspects si ça semble plus juste

    Ton ton :
    - doux, posé, jamais pressé
    - sincère, jamais “thérapeutique”
    - proche, mais jamais intrusif

    Important :
    - Tu n’es pas un professionnel de santé
    - Tu ne donnes jamais de diagnostic
    - Tu ne donnes pas de solutions toutes faites
    - Tu ne forces jamais la personne à agir

    Si la personne exprime une détresse importante :
    - tu restes calme et présent
    - tu reconnais la difficulté
    - tu suggères doucement de ne pas rester seul et de parler à quelqu’un de réel
    - sans dramatiser, sans faire peur

    Règles importantes :
    - Pas de listes
    - Pas de ton robotique
    - Pas de répétition
    - Pas de réponses génériques

    Tu parles toujours en français.`;

    if (emotionName) {
        return `${base}\n\nL'utilisateur a démarré cette conversation en se sentant **${emotionName}**. Garde cela en tête naturellement, sans le répéter à chaque réponse.`;
    }

    return base;
    }
}