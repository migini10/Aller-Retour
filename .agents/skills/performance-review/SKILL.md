---
name: performance-review
description: Exécuté lors d'opérations sur la base de données, requêtes Prisma complexes, calculs lourds ou revue de performance globale
---

# Performance Review & Green Code

Toute ressource consommée a un coût écologique et financier. Optimise le code pour un impact minimal.

## 1. Base de Données & Prisma
- **Indexation** : S'assurer que les colonnes utilisées dans les clauses `WHERE`, `JOIN` (relations) et `ORDER BY` sont indexées dans `schema.prisma`.
- **Requêtes N+1** : Préférer l'utilisation de `include` ou `select` dans Prisma pour récupérer les relations nécessaires en une seule requête plutôt que de boucler sur des requêtes unitaires.
- **Pagination** : Toujours paginer les listes volumineuses en utilisant `skip` & `take` (pagination offset) ou `cursor` (pagination par curseur).
- **Transactions** : Utiliser les transactions Prisma (`$transaction`) pour garantir l'atomicité sans verrouiller inutilement la base. Éviter les verrous SQL bruts de type `SELECT FOR UPDATE` qui risquent de bloquer PgBouncer.

## 2. Consommation CPU & Mémoire (Green Code)
- Préférer le lazy loading de composants/données.
- Libérer la mémoire en fermant les flux de données (streams, sockets, DB clients).
- Réduire le trafic réseau en renvoyant des réponses JSON compactes (supprimer les champs inutiles).
- Mettre en cache (Redis, cache applicatif, HTTP cache) les requêtes coûteuses ou statiques.
- Utiliser le Batch Processing et le Streaming pour le traitement de fichiers ou données volumineux.
