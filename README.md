# With Subtitles AI API

Super simple node server to be used as a service for small CPU AI (e.g. punctuate).

## Current context

- Using OVH VPS (North America, Canada)
- pm2 - manage the service
- Caddy - reverse proxy with ssl
- domain: ai.withsubtitles.app

- Note: there is a fallback VPS configured on Mikrus but it's much slower

## Configure VPS

- install nvm
- nvm install 22
- nvm alias default 22
- nvm use 22
- npm i -g pm2
- install git-lfs
- clone the repo
- git fetch prod
- git checkout prod

- create .env file
- update path of env file in pm2.config.js

- pm2 startup
- pm2 start pm2.config.js
- pm2 save
