#!/bin/bash

REQUIRED_PROGRAMS=(node npm git)
BOWER_MODULES=(Materialize jquery font-awesome)
STATIC_DIRS=(css font fonts images js)

# Sanity checks
for cmd in $REQUIRED_PROGRAMS
do
    command -v $cmd >/dev/null 2>&1 || { echo >&2 "I require $cmd but it's not installed.  Aborting."; exit 1; }
done

#if [[ $EUID -ne 0 ]]; then
#    echo "This script must be run as root" 1>&2
#    exit 1
#fi

# Get the outrageous amount of libs this requires
npm install 
npm install -g bower
bower install --allow-root

# Get client side scripts and styles
mkdir -p public/font public/js public/fonts public/css/highlight/

cp -R bower_components/Materialize/dist/* public/
cp -R bower_components/jquery/dist/* public/js/
cp -R bower_components/font-awesome/css/* public/css/
cp -R bower_components/font-awesome/fonts/* public/fonts/
cp -R bower_components/highlightjs/highlight.pack.min.js public/js/highlight.min.js
cp -R bower_components/highlightjs/highlight.pack.js public/js/highlight.js
cp -R bower_components/highlightjs/styles/* public/css/highlight/

npm install -g pm2

echo "Please enter the following command to run DBLS"
echo "pm2 start bin/www --name \"DBLS\""
