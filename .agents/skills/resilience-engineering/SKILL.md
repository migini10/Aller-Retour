---
name: resilience-engineering
description: Exécuté pour le traitement d'erreurs, l'analyse de root cause suite à un bug, ou la sécurisation de l'application contre les pannes (offline, timeout, etc.)
---

# Resilience Engineering & Edge Cases

L'application doit rester stable et cohérente même en cas de pannes d'infrastructure ou de comportements extrêmes.

## 1. Gestion des Edge Cases (Cas Limites)
- **Valeurs** : Toujours valider et gérer les valeurs vides (`null`, `undefined`, chaînes vides).
- **Temps & Dates** : Gérer correctement les fuseaux horaires, les heures d'été (DST) et les années bissextiles.
- **Race Conditions & UI** : Gérer les double-clics (debouncing/throttling) et les requêtes simultanées.
- **Mode Hors Ligne** : Gérer l'absence de réseau sur l'application mobile et fournir un feedback clair à l'utilisateur.

## 2. Prédiction de Pannes & Résilience
- **Panne Réseau & API** : Prévoir des mécanismes de retry exponentiel avec gigue (jitter) pour les appels réseau.
- **Base de Données Indisponible** : Gérer l'échec de connexion à la base de données de manière propre (messages d'erreurs clairs, pas de crash de l'instance).
- **Idempotence des Webhooks** : Gérer les doublons de webhooks (notamment de paiement Stripe/Wave) pour éviter la double facturation ou les doublons de réservation.

## 3. Analyse Root Cause (Cause Racine)
- En cas de bug, ne pas appliquer de correctif superficiel (rustine).
- Analyser la chaîne de dépendances, identifier la cause racine et appliquer un correctif durable qui empêche le bug de réapparaître.
