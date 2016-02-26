#!/bin/bash

REQUIRED_PROGRAMS=(node npm git)
BOWER_MODULES=(Materialize jquery)

# Sanity checks
for cmd in $REQUIRED_PROGRAMS
do
    command -v $cmd >/dev/null 2>&1 || { echo >&2 "I require $cmd but it's not installed.  Aborting."; exit 1; }
done

if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

# Get the outrageous amount of libs this requires
npm install 
npm install -g bower
bower install --allow-root

for mod in $BOWER_MODULES
do
    cp bower_components/$mod/dist/* public/
done

mv public/*.js public/js/

npm install -g pm2