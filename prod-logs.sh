#!/bin/bash

# Deploy script
# This script will deploy the service to the remote server
# It will create an archive of the current directory and copy it to the remote server
# It will then unpack the archive and start the service
#
# IMPORTANT: make sure to have the .env.withsubtitles-ai file in the root directory of the remote server

# Exit on any error, undefined variables, and pipe failures
set -euo pipefail

# Check if .env file exists
if [[ ! -f ".env" ]]; then
    echo ".env file not found in current directory"
    exit 1
fi

# Read DEPLOY_DROPLET_IP from .env file
echo "Reading configuration from .env file..."
if ! DEPLOY_DROPLET_IP=$(grep "^DEPLOY_DROPLET_IP=" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'"); then
    echo "Failed to read from .env file"
    exit 1
fi

# Check if DEPLOY_DROPLET_IP is set and not empty
if [[ -z "$DEPLOY_DROPLET_IP" ]]; then
    echo "DEPLOY_DROPLET_IP is not set or empty in .env file"
    exit 1
fi

ssh -tt "root@$DEPLOY_DROPLET_IP" << EOF
    cd withsubtitles-mobile-ai
    npm run pm2:logs
EOF
