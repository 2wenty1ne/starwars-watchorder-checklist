#!/bin/bash

cd "/home/web/web-hosting/starwars-watchorder-checklist/checklist-client"
npm run build

sudo rm -r "/home/web/web-hosting/starwars-watchorder-checklist/checklist-server/public/*"

sudo mv "/home/web/web-hosting/starwars-watchorder-checklist/checklist-client/build/*" "/home/web/web-hosting/starwars-watchorder-checklist/checklist-server/public/"
