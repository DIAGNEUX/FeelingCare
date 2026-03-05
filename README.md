# FeelingCare 💙

FeelingCare est une application web d’écoute émotionnelle assistée par IA.  
Elle permet à une personne de parler librement de ce qu’elle ressent dans un espace bienveillant et non jugeant.

---

## 🧠 Vision

- IA empathique
- Reformulation et questions ouvertes
- Pas de diagnostic médical
- Expérience simple et humaine

---

## 🏗️ Architecture

Monorepo NPM :

```

apps/
api/   → Backend (NestJS + Prisma + PostgreSQL)
web/   → Frontend (Next.js 14 + Tailwind)

````

---

## 🛠️ Stack

**Frontend**
- Next.js 14
- TypeScript
- TailwindCSS

**Backend**
- NestJS
- Prisma ORM
- PostgreSQL (Docker)

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/DIAGNEUX/FeelingCare.git
cd FeelingCare
````

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer la base de données

```bash
docker compose up -d
```

### 4. Lancer le backend

```bash
npm run dev --workspace=apps/api
```

### 5. Lancer le frontend

```bash
npm run dev --workspace=apps/web
```

---

## 🔐 Variables d’environnement

### Backend (`apps/api/.env`)

```
DATABASE_URL=...
OPENAI_API_KEY=...
PORT=3001
```

### Frontend (`apps/web/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🌿 Git Workflow

* `main` → stable
* `dev` → développement
* `feature/*` → nouvelles fonctionnalités

Pull Requests obligatoires avant merge sur `main`.

---

## ⚠️ Disclaimer

FeelingCare ne remplace pas un professionnel de santé.

````

---
