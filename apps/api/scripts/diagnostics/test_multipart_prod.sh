#!/bin/bash

# Créer 3 fausses images pour le test
touch /tmp/front.jpg /tmp/rear.jpg /tmp/side.jpg

echo "Entrez votre token JWT DRIVER OWNER (obtenu via l'app mobile) :"
read DRIVER_TOKEN

echo "Lancement du test multipart sur Render..."
curl -v -X POST https://aller-retour.onrender.com/v1/drivers/me/vehicles \
  -H "Authorization: Bearer $DRIVER_TOKEN" \
  -F "plateNumber=TEST-1234" \
  -F "type=SEDAN" \
  -F "brand=Toyota" \
  -F "model=Corolla" \
  -F "year=2020" \
  -F "frontPhoto=@/tmp/front.jpg" \
  -F "rearPhoto=@/tmp/rear.jpg" \
  -F "sidePhoto=@/tmp/side.jpg"
