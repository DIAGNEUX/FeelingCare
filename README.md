# FeelingCare

FeelingCare est une application web d'écoute émotionnelle assistée par IA.

Elle propose un espace simple où un utilisateur peut exprimer ce qu'il ressent, démarrer une conversation sans compte, puis conserver son historique et suivre son évolution lorsqu'il est connecté.

## Intention Du Projet

FeelingCare part d'un constat simple : beaucoup de personnes ressentent parfois le besoin de parler, mais n'ont pas toujours quelqu'un à qui se confier.

Parler à son entourage peut être difficile par peur d'être jugé, de déranger, de ne pas être compris ou de ne pas être pris au sérieux. Ce silence peut renforcer la confusion intérieure et le sentiment de solitude.

L'objectif de FeelingCare n'est pas de résoudre les problèmes à la place de l'utilisateur. L'application cherche plutôt à offrir un premier espace de respiration pour :

- mettre des mots sur ce qui est ressenti ;
- clarifier une émotion ou une situation ;
- se sentir écouté sans être jugé ;
- prendre un peu de recul.

FeelingCare ne remplace pas un professionnel de santé. Le produit reste volontairement centré sur l'écoute, la reformulation et l'accompagnement émotionnel léger.

## Parcours Utilisateur

L'application propose deux niveaux d'expérience.

En mode invité, l'utilisateur peut choisir une humeur ou commencer directement une conversation. Rien n'est enregistré, ce qui permet de tester l'expérience sans friction.

En mode connecté, l'utilisateur retrouve ses conversations, son dashboard émotionnel et son profil. Les conversations ne sont créées en base qu'après le premier message utilisateur, afin d'éviter d'enregistrer des échanges vides.
## Aperçu Visuel
<img width="763" height="383" alt="image" src="https://github.com/user-attachments/assets/3b8a816d-3f9d-4fdf-8292-e712c14a6059" />

## Fonctionnalités

- Choix d'une humeur au démarrage.
- Conversation invitée temporaire, sans compte.
- Authentification par inscription et connexion.
- Conversations sauvegardées pour les utilisateurs connectés.
- Réponses IA en streaming.
- Génération automatique du titre d'une conversation après plusieurs messages.
- Sidebar d'historique dans l'espace de chat.
- Dashboard avec résumé, signaux exprimés, tendances et exercice de respiration.
- Mode écoute pour des réponses plus courtes et moins directives.
- Profil utilisateur avec modification du prénom, du nom et du mot de passe.
- Interface responsive.
- Mode clair et mode sombre.

## Points Techniques

- Monorepo organisé avec NPM workspaces.
- Frontend en Next.js, TypeScript et Tailwind CSS.
- Backend en NestJS avec architecture par modules.
- Persistance avec Prisma et PostgreSQL.
- Authentification JWT avec refresh token en cookie `httpOnly`.
- Rotation des sessions de refresh token.
- Vérification de propriété sur les conversations.
- Validation globale des entrées côté API.
- Orchestration IA séparée dans un module dédié.
- Gestion distincte des conversations invitées et connectées.

## Sécurité IA Et Limites

Le sujet de l'application touche au bien-être émotionnel. Le projet intègre donc plusieurs garde-fous :

- les prompts interdisent le diagnostic et les conseils médicaux ;
- une couche de classification estime le niveau de risque du message ;
- les messages de crise déclenchent une stratégie de réponse plus prudente ;
- le mode écoute est désactivé automatiquement si une situation de crise est détectée ;
- un fallback par mots-clés existe si la classification IA échoue ;
- les logs IA sensibles sont désactivés par défaut.

Limites actuelles :

- pas encore d'intégration de numéros d'urgence selon le pays ;
- pas de validation clinique ;
- pas encore de rate limiting ;
- pas de système de modération externe dédié.

## Stack

Frontend :

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

Backend :

- NestJS
- Prisma
- PostgreSQL
- OpenAI API
- JWT
- Cookies `httpOnly`

## Architecture

```text
apps/
  api/
    prisma/
    src/modules/auth/
    src/modules/conversation/
    src/modules/dashboard/
    src/modules/ai/
    src/modules/guest-chat/

  web/
    src/app/
    src/lib/api/
    src/lib/types.ts
```

Principes principaux :

- `apps/web` gère l'interface, l'état d'authentification côté client et les appels API.
- `apps/api` gère l'authentification, la persistance, les vérifications d'accès et l'orchestration IA.
- Les conversations invitées ne sont jamais sauvegardées.
- Les conversations connectées sont créées uniquement après le premier message utilisateur.

## Installation Locale

Installer les dépendances :

```bash
npm install
```

Lancer PostgreSQL :

```bash
docker compose up -d
```

Appliquer les migrations Prisma :

```bash
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
```

Lancer l'API :

```bash
npm --workspace apps/api run start:dev
```

Lancer le frontend :

```bash
npm --workspace apps/web run dev
```

## Variables D'environnement

API, dans `apps/api/.env` :

```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_SECONDS=900
FRONTEND_URL=http://localhost:3000
PORT=3001
```

Options de debug :

```env
AUTH_DEBUG=false
AI_DEBUG=false
```

Web, dans `apps/web/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Commandes Utiles

Vérifier le frontend :

```bash
npm --workspace apps/web run lint
npm --workspace apps/web run build
```

Vérifier l'API :

```bash
npm --workspace apps/api run build
```


## Disclaimer

FeelingCare est un projet éducatif. L'application ne remplace pas un professionnel de santé et ne doit pas être utilisée comme service d'urgence.
