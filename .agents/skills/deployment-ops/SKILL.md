---
name: deployment-ops
description: Exécuté lors de modifications de Dockerfile, configurations Render/Supabase, variables d'environnement, pipelines de CI/CD ou scripts de build
---

# Deployment & Operations Readiness

Le code doit être prêt pour être conteneurisé, déployé et supervisé de manière industrielle.

## 1. Conteneurisation & Build
- **Docker** : Utiliser des builds multi-étapes (multi-stage) pour minimiser la taille de l'image de production finale. Utiliser des images de base légères (Alpine, Distroless).
- **Processus de Build** : S'assurer que les dépendances de dev ne sont pas embarquées en production. Vérifier l'ordre de copie dans le Dockerfile pour maximiser la mise en cache des couches (layers).

## 2. CI/CD & Déploiement
- Concevoir des déploiements sans interruption de service (Zero-Downtime Deployments).
- **Rollback** : Les migrations de base de données doivent être rétrocompatibles (méthode expand and contract) afin de permettre un retour arrière instantané de l'application sans casser la base de données.

## 3. Observabilité & Résilience
- **Logs** : Produire des logs structurés (JSON en production), clairs et sans données sensibles.
- **Healthcheck** : Fournir un endpoint `/health` ou `/status` pour permettre aux orchestrateurs (Kubernetes, Render) de superviser l'état de l'application.
- **Tolérance aux pannes** : Prévoir des timeouts sur toutes les requêtes HTTP sortantes et connexions aux bases de données externes.
