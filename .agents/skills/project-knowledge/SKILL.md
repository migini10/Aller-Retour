---
name: project-knowledge
description: Exécuté lorsque des questions sur la stack, l'architecture du projet, les conventions de code ou les structures de données d'Aller-Retour sont posées
---

# Project Knowledge & Stack Context

Contexte métier et technique spécifique au projet **Aller-Retour**.

## 1. Description du Projet
Aller-Retour est une plateforme SaaS de réservation de trajets interurbains (ex: Dakar - Touba) qui connecte des passagers et des chauffeurs.
Elle comporte :
- Un backend **NestJS** (API REST + Prisma + PostgreSQL)
- Une application mobile **Flutter** (Dart)
- Un portail web **Next.js** (React)

## 2. Accès aux Références
Pour toute question d'implémentation spécifique au projet, consulte les fichiers de référence suivants :
- **Stack & Architecture** : `references/stack.md`
- **Conventions de Code** : `references/conventions.md`

## 3. Base de Données
- Le schéma Prisma principal se trouve dans [schema.prisma](file:///Users/macbookair/Aller-Retour/packages/database/prisma/schema.prisma).
- Toutes les relations critiques (Chauffeur `User` ➔ `DriverProfile` ➔ `DriverEarning`) doivent respecter le schéma défini.
- Attention aux conflits de clés étrangères lors de la manipulation des entités `Booking` et `DriverEarning`.
