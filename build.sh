#!/bin/bash

REQUIRED_PROGRAMS=(node npm)

# Sanity checks
for cmd in $REQUIRED_PROGRAMS
do
    command -v $cmd >/dev/null 2>&1 || { echo >&2 "I require $cmd but it's not installed.  Aborting."; exit 1; }
done


# Get the outrageous amount of libs this requires
npm install 
command -v bower >/dev/null 2>&1 || { echo >&2 "I require bower but it's not installed.  Installing."; sudo npm -g install bower; }
bower install

cp exercise.default.db exercise.db

echo "GREAT! DBLS should now be ready to go just type the following to start!"
echo "npm start"
