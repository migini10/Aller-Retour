# Code Conventions & Best Practices

## 1. Naming Conventions
- **TypeScript (API & Web)** :
  - Nommage de fichiers : `kebab-case` (ex: `bookings.controller.ts`, `auth.service.ts`).
  - Classes, interfaces et enums : `PascalCase` (ex: `BookingsController`, `CreateBookingDto`).
  - Variables, fonctions et propriétés : `camelCase` (ex: `createBooking`, `bookingId`).
- **Dart (Flutter Mobile)** :
  - Nommage de fichiers : `snake_case` (ex: `qr_code_screen.dart`).
  - Classes : `PascalCase`.
  - Variables/méthodes : `camelCase`.

## 2. API Design & Patterns
- Versions des endpoints sous le préfixe `/v1/`.
- Les contrôleurs NestJS doivent valider les entrées à l'aide de `ValidationPipe` et de classes DTO décorées avec `class-validator`.
- Toujours renvoyer des réponses typées en utilisant les types du package `@aller-retour/types`.

## 3. Gestion des Erreurs API
- Ne jamais retourner des stack traces brutes en production.
- Utiliser les exceptions NestJS standard (`HttpException`, `NotFoundException`, `ForbiddenException`).
