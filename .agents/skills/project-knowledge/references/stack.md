# Tech Stack & Architecture de Aller-Retour

Ce document résume la stack technologique et l'organisation du monorepo **Aller-Retour**.

## 1. Monorepo Structure
Le projet utilise un monorepo géré par **Turborepo** et **npm workspaces** :

- `/apps/api` : Le backend principal développé avec **NestJS**.
- `/apps/mobile` : L'application mobile développée en **Flutter / Dart**.
- `/apps/web` : Le portail web développé avec **Next.js** (App Router).
- `/packages/database` : Le schéma Prisma, les migrations et le client de base de données partagé.
- `/packages/types` : Les types TypeScript partagés entre l'API et le Web.

## 2. Technologies Clés
- **Backend** : NestJS (TypeScript), RxJS, Nodemailer, Passport JWT.
- **Base de données** : PostgreSQL hébergé sur Supabase, Prisma ORM, PgBouncer en mode transactionnel.
- **Mobile** : Flutter, Riverpod (state management), GoRouter, custom QR rendering.
- **Déploiement** : Render (API en production, builds automatiques via hooks git sur `main`), Vercel (Next.js web portal).
