#!/bin/bash

REQUIRED_PROGRAMS=(node npm git)
BOWER_MODULES=(Materialize jquery font-awesome)
STATIC_DIRS=(css font fonts images js)

# Sanity checks
for cmd in $REQUIRED_PROGRAMS
do
    command -v $cmd >/dev/null 2>&1 || { echo >&2 "I require $cmd but it's not installed.  Aborting."; exit 1; }
done


# Get the outrageous amount of libs this requires
npm install 
sudo npm install -g bower
bower install

sudo npm install -g pm2

cp exercise.default.db exercise.db

echo "Please enter the following command to run DBLS"
echo "pm2 start bin/www --name \"DBLS\""
