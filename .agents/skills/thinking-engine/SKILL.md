---
name: thinking-engine
description: Exécuté lorsqu'une analyse de problème complexe, une refactorisation ou un choix d'architecture est demandé
---

# Thinking Engine — Processus de Réflexion Approfondi

Avant de répondre à une problématique complexe ou de modifier du code, applique cette rigueur :

## 1. Analyse Initiale (Root Cause & Ambiguïté)
- Identifie le symptôme vs la cause racine.
- Identifie les dépendances ou modules impliqués.
- Recherche toute ambiguïté ou sous-spécification.

## 2. Évaluation des Contraintes & Risques
- Contraintes techniques (stack, base de données, limitations d'API).
- Risques de performance (concurrence, CPU, mémoire, requêtes SQL N+1).
- Risques de sécurité (injections, authentification, permissions, OWASP).
- Risques opérationnels (tolérance aux pannes, rollback, variables d'env).

## 3. Comparaison des Options
- Propose au moins deux options viables lorsque pertinent.
- Analyse les forces et faiblesses de chaque option.
- Choisis la solution la plus simple, robuste et durable (pas de rustine).

## 4. Rigueur d'Implémentation
- SOLID, DRY, KISS.
- Validation automatique de tous les types et edge cases (null, empty, types).
