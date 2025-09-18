# Task Manager Front

Mini gestionnaire de tâches collaboratif — Frontend

## Stack technique

- **React** (TypeScript)
- **Vite** (build ultra-rapide)
- **TanStack Query** (gestion des requêtes et du cache)
- **Axios** (requêtes HTTP)
- **React Router** (navigation)
- **Tailwind CSS** (UI moderne)

## Fonctionnalités principales

- Authentification JWT (connexion, inscription)
- Dashboard des tâches (CRUD)
- Communication avec une API Django REST (backend séparé)
- Gestion du token JWT (localStorage)
- Navigation Login / Inscription / Dashboard

## Structure du projet

```
front/
├── src/
│   ├── App.tsx            # Routing principal
│   ├── main.tsx           # Entrée de l'app, providers
│   ├── assets/styles/     # Styles globaux
│   ├── pages/
│   │   ├── LoginPage.tsx      # Page de connexion
│   │   ├── SignUpPage.tsx     # Page d'inscription
│   │   ├── DashboardPage.tsx  # Liste et gestion des tâches
│   ├── models/
│   │   └── tasks.ts           # Typage des tâches
│   ├── services/
│   │   └── apiServices.ts     # Fonctions Axios pour l'API
│   └── ...
├── public/               # Fichiers statiques
├── package.json          # Dépendances
├── vite.config.ts        # Config Vite
└── ...
```

## Installation & lancement

```bash
cd front
npm install
npm run dev
```

## Configuration

- L’URL de l’API backend est définie dans un fichier environnement à part.
- Les tokens JWT sont stockés dans le localStorage après connexion.
- Les endpoints `/api/token/`, `/api/register/`, `/api/tasks/` sont utilisés pour l’auth et le CRUD.

## Fonctionnement

1. **Inscription** : Crée un nouvel utilisateur via `/api/register/`.
2. **Connexion** : Récupère un token JWT via `/api/token/`.
3. **Dashboard** : Affiche, crée, modifie, supprime des tâches via `/api/tasks/` (token requis).

## Bonnes pratiques

- Utilise TanStack Query pour toutes les requêtes (mutations, queries).
- Sépare bien les modèles, services et pages pour la clarté.
- Utilise Tailwind pour un style rapide et moderne.

