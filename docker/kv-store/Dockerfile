FROM         ubuntu:14.04

MAINTAINER   shrisha.sb@gmail.com

RUN          apt-get update && apt-get install -y redis-server

RUN          wget -qO- https://deb.nodesource.com/setup_4.x | bash -

RUN          apt-get install nodejs