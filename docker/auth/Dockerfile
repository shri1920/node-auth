FROM nodesource/node:4.0

MAINTAINER shrisha.sb@gmail.com

RUN mkdir /opt/mMolecules-auth

COPY   ./source/authentication.js  /opt/mMolecules-auth/

COPY   ./source/package.json       /opt/mMolecules-auth/

COPY   ./source/route/*            /opt/mMolecules-auth/route/

COPY   ./source/utils/*            /opt/mMolecules-auth/utils/

RUN cd /opt/mMolecules-auth; npm install .

RUN mkdir /var/log/mMolecules-auth; chmod 777 /var/log/mMolecules-auth

WORKDIR /opt/mMolecules-auth

ENTRYPOINT ["node", "/opt/mMolecules-auth/authentication.js"]
