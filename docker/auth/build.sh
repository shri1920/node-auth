#!/bin/bash

# Set the Variables
set -e

WHICH='/usr/bin/which'
DOCKER=`${WHICH} docker`
FIGLET=`${WHICH} figlet`
GIT=`${WHICH} git`
DATE=`${WHICH} date`
WHOAMI=`${WHICH} whoami`

# Delete the Dir source if the directory is already present
if [ -d source ]; then
    rm -rf source
fi

# Create Directory to store the code
mkdir source

# To create the Banner
if [ -n ${FIGLET} ]; then
    ${FIGLET} mMolecules Auth  > source/banner.txt
fi

# To display information about the current build
echo '\n'
echo ver `${GIT} rev-parse --short HEAD` build @ `${DATE}` by `${WHOAMI}`
echo '\n'
cat ./source/banner.txt
echo '\n'

# Copy the content from dir 'code' to 'source'
cp -rf ../code/route ../code/utils ../code/authentication.js ../code/package.json ./source

# To build the Docker image
echo '\n ----- Building the Docker Image : docker.mmolecules/auth ----- \n'
docker build -t docker.mmolecules/auth .

echo '\n ----- To start the Docker container ----- \n'
echo ' docker run --name mmolecules-auth -d -p 5100:5100 docker.mmolecules/auth '
