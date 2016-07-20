#!/bin/bash

# Set the Variables
set -e

WHICH='/usr/bin/which'
DOCKER=`${WHICH} docker`
FIGLET=`${WHICH} figlet`
DATE=`${WHICH} date`
WHOAMI=`${WHICH} whoami`

# To create the Banner
if [ -n ${FIGLET} ]; then
    ${FIGLET} mMolecules Auth-Store  > ./banner.txt
fi

# To display information about the current build
echo '\n'
echo ver 'mMolecules Auth-Store (Redis)' build @ `${DATE}` by `${WHOAMI}`
echo '\n'
cat ./banner.txt
echo '\n'

# To build the Docker image for Key Value store (Redis)
echo '\n ----- Building the Docker Image : docker.mmolecules/auth-store ----- \n'
docker build -t docker.mmolecules/auth-store .

echo '\n ----- To start the Docker container ----- \n'
echo 'docker run --name mmolecules-auth-store -d docker.mmolecules/auth-store'

