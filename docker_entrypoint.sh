#!/bin/bash
set -euo pipefail

if [[ ${1:-} == "nginx" ]]
then
    sed -i "s#RIKARDO_URL_PLACEHOLDER#$RIKARDO_URL#" /etc/nginx/sites-enabled/default
        
    >&2 echo "Running nginx..."
    nginx -g "daemon off;"

else
    >&2 echo "Running rikardo-todo..."

    node index.js
fi
