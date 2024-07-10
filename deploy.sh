#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
NVM_DIR="/root/.nvm/versions/node/v21.7.3/bin"
PM2="$NVM_DIR/npx pm2"
NODE="$NVM_DIR/node"
NPM="$NVM_DIR/npm"
PROJECT_DIR="/root/dnk-bot"  # coolpixels set this to the correct one

# Add Node.js to the PATH
export PATH=$NVM_DIR:$PATH

# Change to the project directory
cd $PROJECT_DIR

# Stop the existing run
echo "Stopping the existing run"
$PM2 delete all || echo "No running processes to stop"

# Remove the existing build
echo "Removing the existing build"
rm -rf dist || { echo "Failed to remove existing build"; exit 1; }

# Pull the latest code
echo "Pulling the latest code"
git pull || { echo "Failed to pull latest code"; exit 1; }

# Install dependencies
echo "Installing dependencies"
$NPM install || { echo "Failed to install dependencies"; exit 1; }

# Build the new code
echo "Building"
$NPM run build || { echo "Build failed"; exit 1; }

# Start the new code
echo "Running"
$PM2 start dist/index.js || { echo "Failed to start application"; exit 1; }

echo "Deployment completed successfully"
