#!/bin/bash

# Deploy script
# This script will deploy the service to the remote server
# It will create an archive of the current directory and copy it to the remote server
# It will then unpack the archive and start the service

# Exit on any error, undefined variables, and pipe failures
set -euo pipefail

# Check if .env file exists
if [[ ! -f ".env" ]]; then
    echo ".env file not found in current directory"
    exit 1
fi

# Read VPS_ADDRESS from .env file
echo "Reading configuration from .env file..."
if ! VPS_ADDRESS=$(grep "^VPS_ADDRESS=" .env | cut -d'=' -f2 | tr -d '"' | tr -d "'"); then
    echo "Failed to read from .env file"
    exit 1
fi

# Check if VPS_ADDRESS is set and not empty
if [[ -z "$VPS_ADDRESS" ]]; then
    echo "VPS_ADDRESS is not set or empty in .env file"
    exit 1
fi

ssh -tt "$VPS_ADDRESS" << EOF
    cd withsubtitles-mobile-ai

    # Check if there are local changes (unstaged or staged)
    if [[ -n \$(git status --porcelain) ]]; then
        echo "Error: Local changes detected. Please commit or stash changes before update."
        exit 1
    fi

    # Check if local prod branch is in the history of origin/prod
    git fetch origin prod
    if ! git merge-base --is-ancestor prod origin/prod; then
        echo "Error: Local prod branch has diverged from origin/prod. Please resolve conflicts first."
        exit 1
    fi

    git pull origin prod
    pm2 restart pm2.config.js
EOF
