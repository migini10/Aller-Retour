---
name: security-audit
description: Exécuté pour toute modification d'API, de base de données, d'authentification, de permissions ou d'upload de fichiers
---

# Security Audit — Audit de Sécurité Systématique

Chaque modification du code doit être auditée sous l'angle de la sécurité.

## 1. Risques Majeurs (OWASP)
- **Injections** : SQL, NoSQL, Commande. Toujours utiliser Prisma avec des requêtes paramétrées. Éviter `$queryRawUnsafe` sauf absolue nécessité et avec validation stricte.
- **Authentification & Session** : Vérifier que les tokens JWT sont correctement extraits, validés, et qu'ils n'ont pas expiré prématurément.
- **Exposition de Données Sensibles** : Ne jamais retourner de mots de passe, hashs, codes secrets, PINs ou clés d'API dans les réponses de l'API. Filtrer les champs dans Prisma.
- **Contrôle d'Accès (IDOR, RBAC)** : Vérifier que l'utilisateur connecté possède bien les droits pour lire ou modifier la ressource ciblée (par exemple, vérifier `userId` ou `companyId`).
- **Rate Limiting** : Protéger les routes sensibles (login, register, SMS/email verification, payment) contre les attaques par force brute ou déni de service.

## 2. Upload de Fichiers & Entrées
- Valider le type MIME, l'extension et la taille des fichiers téléversés.
- Assainir les entrées utilisateurs pour éviter XSS (Cross-Site Scripting) et injections HTML.

## 3. Gestion des Secrets
- Ne jamais coder de secrets en dur.
- Utiliser uniquement des variables d'environnement (`process.env` ou équivalent Flutter).
