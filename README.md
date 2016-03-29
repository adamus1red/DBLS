# Database Learning system

Introduction to Relational Databases can be daunting to first time users
and those who are not secure in their understanding of the usage of
Relational Databases. The current methodology in use for assigning
exercises to students has the major bottleneck that each question for
each exercise must be individually marked on a per student basis. As
class sizes grow to meet demand, the amount of resources needed to
provide the same level of education to students grows exponentially.

The software that has been developed as part of this project is designed
to remove the bottleneck by removing the need for manual marking of
student exercises. The application was built with the following
requirements

-   Ability to mark student submitted queries

-   Ability to execute arbitrary SQL statements against Lecturer
    provided databases

-   Ability to track student progress


Quick Start
-----------

This guide will help you quickly get a copy of the DBLS up and running

### Requirements

-   Must run nodeJS v4.7 or later

-   Have greater than 512MB ram

### Install

1.  Install [nodeJS](https://nodejs.org/en/download/) if you haven't
    already

2.  Install [MongoDB](https://www.mongodb.org/downloads#production) and
    ensure it’s running

3.  Enter the following into a a terminal in the folder you have the
    DBLS code

    a.  `bash build.sh`

4.  Wait for it to get all its required libraries

    a.  if this is a first time setup you may be asked for your sudo
        password to install some features

5.  Modify the configuration files found in `./config/`

6.  run `npm start` to start the application on port 3000

Production Installation
-----------------------

This will detail how to run a clustered instance of the Database
Learning System to scale

### Requirements {#requirements-1 .ListParagraph}

-   Must run nodeJS v4.7 or later

-   Have greater than 1024MB of RAM

-   Minimum 2 CPU cores

### Install

1.  Install [nodeJS](https://nodejs.org/en/download/) if you haven't
    already

2.  Install [MongoDB](https://www.mongodb.org/downloads#production) and
    ensure it’s running

3.  Enter the following into a a terminal in the folder you have the
    DBLS code

    a.  `bash build.sh`

4.  Wait for it to get all its required libraries

    a.  if this is a first time setup you may be asked for your sudo
        password to install some features

5.  Modify the configuration files found in `./config/`

6.  Install PM2 with the following command `sudo npm -g install pm2`

### Setup

1.  Modify the configuration files found in `./config/`

2.  Start DBLS in cluster mode with the following command

    a.  `pm2 start bin/www -i 0 –name “DBLS”`

3.  The DBLS will now start as in a cluster with up to the number of
    instances started being the number of CPU cores available.

Note: It is advised that DBLS be run behind an NGINX reverse proxy. An
example configuration for this can be found in Appendix A.
