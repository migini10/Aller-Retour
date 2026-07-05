# Code Review Checklist (Quality Gate)

Avant de déclarer une tâche ou une Pull Request comme terminée, passe en revue les points suivants :

## 📋 Qualité du Code
- [ ] Le code est-il facile à comprendre pour un développeur qui découvre le fichier ?
- [ ] Les principes SOLID, DRY et KISS sont-ils respectés ?
- [ ] Y a-t-il du code mort, des logs de débogage temporaires ou des fichiers temporaires à supprimer ?
- [ ] La complexité cyclomatique est-elle faible ?

## ⚙️ Compilation et Robustesse
- [ ] L'application compile-t-elle sans warning majeur ?
- [ ] Tous les cas limites (null, undefined, valeurs extrêmes, tableaux vides, etc.) sont-ils gérés ?
- [ ] Les tests unitaires/intégration ont-ils été exécutés et passent-ils tous avec succès ?

## 🔒 Sécurité et Performance
- [ ] Aucune donnée sensible (mot de passe, jeton API, PIN) n'est renvoyée ou loggée ?
- [ ] Les requêtes à la base de données sont-elles optimisées (pas de requête N+1, index présents) ?
- [ ] Le trafic réseau et la consommation mémoire/CPU sont-ils minimisés ?

## 📚 Documentation et Alignement
- [ ] Le README et les documentations d'architecture ont-ils été mis à jour ?
- [ ] La documentation API Swagger (ou équivalent) est-elle à jour ?
