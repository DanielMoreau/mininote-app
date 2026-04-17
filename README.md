MiniNote Cloud ☁️

Application fullstack de prise de notes construite avec Next.js (App Router).

Démo en ligne
https://mininote-app.vercel.app

Fonctionnalités

Création, lecture, suppression de notes (CRUD)
Épinglage de notes
Interface utilisateur synchronisée avec API
Mode sombre
Déploiement sur Vercel

Stack technique

Next.js 16 (App Router)
React 19
API Routes (backend intégré)
Vitest (tests unitaires)
Vercel (hébergement)

Tests

Tests unitaires et API réalisés avec Vitest.

Commande :
npm run test

Installation locale

git clone <repo>
cd mininote-app
npm install
npm run dev

API

GET /api/notes
POST /api/notes
PATCH /api/notes
DELETE /api/notes?id=...

Limitation actuelle

Les données sont stockées en mémoire (reset côté serveur en production).

Auteur

Projet réalisé par Daniel