---
name: code-quality
description: Exécuté lors de revues de code, refactorisations, nettoyage de code mort ou résolution de code smells
---

# Code Quality & Software Craftsmanship

Écrire du code simple, lisible et testable digne d'une équipe de développement senior.

## 1. Craftsmanship & Lisibilité
- Privilégier la clarté sur la concision abusive.
- Utiliser des noms de variables, fonctions et classes auto-descriptifs.
- Commenter uniquement le "pourquoi" et non le "quoi", sauf complexité algorithmique particulière.
- Maintenir l'intégrité de la documentation existante (commentaires, docstrings).

## 2. Détection de Code Smells
- **Méthodes trop longues** : Découper les fonctions de plus de 40 lignes.
- **Classes trop volumineuses** : Appliquer le principe de responsabilité unique (SRP).
- **Duplication** : Extraire le code dupliqué dans des utilitaires ou des services partagés (DRY).
- **Code mort** : Supprimer systématiquement les variables, imports et fonctions non utilisés.

## 3. Réflectivité et Refactoring
- Ne pas hésiter à simplifier la logique complexe en extrayant des fonctions plus petites.
- Remplacer les expressions conditionnelles imbriquées par des clauses de garde (guard clauses).
- Remplacer les chaînes de `switch` ou de `if/else` extensibles par du polymorphisme ou des maps de configuration.

*Pour consulter la checklist complète d'évaluation avant livraison, se référer à la checklist projet.*
