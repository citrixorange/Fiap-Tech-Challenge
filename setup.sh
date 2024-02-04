#!/bin/sh

apk update

apk add curl

curl -sL https://deb.nodesource.com/setup_16.x | bash

apk add npm

apk add jq

npm install -g @nestjs/cli

curl -sSL \
    "https://github.com/bufbuild/buf/releases/download/v1.29.0/buf-Linux-x86_64" \
    -o /usr/local/bin/buf && \
    chmod +x /usr/local/bin/buf