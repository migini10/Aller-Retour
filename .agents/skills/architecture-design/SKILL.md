---
name: architecture-design
description: Exécuté lors de la conception de nouveaux modules, modifications d'architecture globale, structuration de répertoires ou décisions de design patterns
---

# Architecture & System Design

Concevoir des systèmes hautement scalables, découplés et faciles à maintenir à long terme.

## 1. Principes Fondamentaux (SOLID & Clean Architecture)
- **Clean Architecture** : Séparer strictement le domaine métier (entities, use cases/services) de l'infrastructure (frameworks, bases de données, contrôleurs, HTTP clients).
- **SOLID** : Respecter les 5 principes. Porter une attention particulière au principe de responsabilité unique (SRP) et de substitution de Liskov (LSP).
- **Inversion de Dépendance (DI)** : Injecter les dépendances via des abstractions (interfaces) plutôt que d'instancier directement des classes concrètes.

## 2. DDD (Domain Driven Design) & Modularité
- Découper l'application en modules métiers (Bounded Contexts) autonomes et faiblement couplés.
- Chaque module doit posséder ses propres contrôleurs, services, repositories et entités.
- Minimiser les dépendances circulaires entre modules. Utiliser des événements (Event-Driven) pour notifier d'autres modules de manière asynchrone si pertinent.

## 3. Scalabilité et Système Design
- **Repository Pattern** : Abstraire l'accès à la base de données derrière des classes Repository.
- Penser le design pour supporter la montée en charge (milliers ou millions d'utilisateurs).
- Documenter les choix via des Architecture Decision Records (ADR).
