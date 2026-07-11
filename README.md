# 🚌 ALLER-RETOUR — MOBILITÉ PANAFRICAINE
**Plateforme SaaS Multi-Tenant & Marketplace de Transport Inter-Urbain (Sénégal → Afrique)**

![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-black?style=flat-square&logo=turborepo)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black?style=flat-square&logo=next.js)
![Flutter](https://img.shields.io/badge/Mobile-Flutter_3.x-02569B?style=flat-square&logo=flutter)
![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?style=flat-square&logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16%20+%20PostGIS-4169E1?style=flat-square&logo=postgresql)

---

## 📖 VUE D'ENSEMBLE
**Aller-Retour** est une solution d'entreprise complète conçue pour digitaliser et unifier le secteur du transport inter-urbain (bus, minibus, taxis 7 places) au Sénégal et en Afrique. 

La plateforme combine :
1. **Un portail SaaS B2B Multi-Tenant** : Permettant aux GIE et compagnies de transport de piloter leurs lignes, grilles horaires, véhicules, chauffeurs et comptabilité de manière totalement isolée et sécurisée.
2. **Une Marketplace B2C** : Permettant aux chauffeurs indépendants (libres) certifiés de publier leurs trajets et aux voyageurs de réserver leur place à l'avance.
3. **Un Moteur Financier Séquestre (Escrow)** : Sécurisant 100% des paiements Mobile Money (Wave, Orange Money, MoMo) jusqu'à la validation de l'arrivée.

---

## 🏗️ ARCHITECTURE DU MONOREPO (TURBOREPO)

```text
Aller-Retour/
├── apps/
│   ├── web/               # Next.js 14+ (Portail Admin SaaS, Guichetier & Recherche Trajets)
│   ├── api/               # NestJS (Backend REST, Swagger OpenAPI & Moteur Métier)
│   └── mobile/            # Flutter (App Chauffeur, Client & Terminaux POS Android)
├── packages/
│   ├── database/          # Modèle Prisma BDD unifié (PostgreSQL + PostGIS)
│   └── types/             # Contrats d'interfaces et DTOs partagés
├── docs/                  # Documentation officielle (Vision, Flux, RBAC)
├── turbo.json             # Configuration d'orchestration de build
└── package.json           # Déclaration des workspaces npm
```

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Prérequis
* **Node.js** (v20+ recommandé)
* **npm** (v10+)
* **PostgreSQL** & **Redis**

### 2. Installation des dépendances
```bash
# À la racine du projet
npm install
```

### 3. Configuration de l'environnement
Copiez le fichier de configuration `.env.example` en `.env` à la racine :
```bash
cp .env.example .env
```

### 4. Génération de la base de données & Build global
```bash
# Génère le client Prisma et compile tous les packages en parallèle
npm run build
```

### 5. Lancement des serveurs de développement
```bash
# Lance simultanément le backend NestJS (port 3001) et le frontend Next.js (port 3000)
npx turbo run dev
```
* **Application Web :** `http://localhost:3000`
* **Documentation API Swagger OpenAPI :** `http://localhost:3001/docs`

---

## 🔒 SÉCURITÉ & MULTI-TENANCY

### 1. Isolation des Données (Tenant Guard)
Le modèle de base de données repose sur une base unique avec une colonne discriminante `companyId` (Tenant ID), couplée à la politique de sécurité **PostgreSQL Row-Level Security (RLS)** et au `TenantContextGuard` dans NestJS. Un guichetier d'un GIE ne pourra jamais accéder aux données d'un autre GIE.

### 2. Contrôle d'Accès par Rôles (RBAC)
Le système gère 5 rôles avec des périmètres stricts documentés dans [MATRICE_RBAC_PERMISSIONS.md](./MATRICE_RBAC_PERMISSIONS.md) :
* `SUPER_ADMIN` (Équipe globale)

* `DISPATCHER` (Guichetier / Chef de gare)
* `DRIVER` (Chauffeur affilié ou libre)
* `PASSENGER` (Voyageur / Expéditeur)

---

## 🛠️ DOCUMENTATION DE RÉFÉRENCE COMPLÈTE
Pour approfondir chaque volet du projet, consultez nos documents fondateurs :
* 📜 **Vision Produit & Acteurs :** [VISION_PRODUIT.md](./VISION_PRODUIT.md)
* 🌍 **Analyse Terrain & Flux Métier :** [ANALYSE_TERRAIN_ET_FLUX.md](./ANALYSE_TERRAIN_ET_FLUX.md)
* ⚙️ **Architecture Technique :** [ARCHITECTURE_TECHNIQUE.md](./ARCHITECTURE_TECHNIQUE.md)
* 🛠️ **Stack & Infrastructure Cloud :** [STACK_TECHNIQUE_ET_INFRASTRUCTURE.md](./STACK_TECHNIQUE_ET_INFRASTRUCTURE.md)
* 🔐 **Matrice des Rôles & Permissions :** [MATRICE_RBAC_PERMISSIONS.md](./MATRICE_RBAC_PERMISSIONS.md)
* 📋 **Spécifications Fonctionnelles :** [SPECIFICATIONS_FONCTIONNELLES.md](./SPECIFICATIONS_FONCTIONNELLES.md)

---

## ☁️ DÉPLOIEMENT PRODUCTION
* **Web App (`apps/web`) :** Connecté sur Vercel avec déploiement automatique via `git push`.
* **API Backend (`apps/api`) :** Conteneurisé via le `Dockerfile` racine et déployé sur DigitalOcean App Platform.
* **Bases de Données :** Hébergé sur DigitalOcean Managed PostgreSQL & Redis en réseau VPC isolé.
