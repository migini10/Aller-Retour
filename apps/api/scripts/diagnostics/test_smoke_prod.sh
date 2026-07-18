#!/bin/bash

# Demandez le token SUPER_ADMIN
echo "Entrez votre token JWT SUPER_ADMIN (obtenu depuis l'app web en vous connectant en tant qu'admin) :"
read ADMIN_TOKEN

echo "Lancement du smoke test sur Render..."
curl -s -X POST https://aller-retour.onrender.com/v1/drivers/admin/storage/vehicle-photo-smoke-test \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
