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


## Quick Start

This guide will help you quickly get a copy of the DBLS up and running

### Requirements
- Must run nodeJS v4.7 or later
- Have greater than 512MB ram

### Intall

1. Install [nodeJS](https://nodejs.org/en/download/) if you haven't already
* Install [MongoDB](https://www.mongodb.org/downloads#production)
* Enter the following into a a terminal in the folder you have the DBLS code\
`bash build.sh`
* Wait for it to get all it's required libraries
  * if this is a first time setup you may be asked for your sudo password to install some features
* run `npm start` to start the application on port 3000
