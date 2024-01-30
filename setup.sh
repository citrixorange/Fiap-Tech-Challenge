#!/bin/bash

apt-get update

apt-get install -y \
    curl \

curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@8.3.1

npm install -g @nestjs/cli

curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v1.29.0/buf-Linux-x86_64" \
    -o /usr/local/bin/buf && \
    chmod +x /usr/local/bin/buf