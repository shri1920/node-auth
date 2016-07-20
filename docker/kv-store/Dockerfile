# Set the base image to Ubuntu 14.04
FROM        ubuntu:14.04

# Author
MAINTAINER shrisha.sb@gmail.com

# Update the repository and install Redis Server
RUN         apt-get update && apt-get install -y redis-server

# Expose Redis port 6379
EXPOSE      6379

# Run Redis Server
ENTRYPOINT  ["/usr/bin/redis-server"]
