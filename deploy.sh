#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
PROJECT_NAME=""
NVM_DIR="$HOME/.nvm/versions/node"
LATEST_NODE_VERSION=$(ls -v $NVM_DIR | tail -n 1)
NODE_BIN_DIR="$NVM_DIR/$LATEST_NODE_VERSION/bin"
PM2="$NODE_BIN_DIR/npx pm2"
NODE="$NVMNODE_BIN_DIR_DIR/node"
NPM="$NODE_BIN_DIR/npm"
PROJECT_DIR="$HOME/$PROJECT_NAME"

# Add Node.js to the PATH
export PATH=$NODE_BIN_DIR:$PATH

# Change to the project directory
cd $PROJECT_DIR

# Stop the existing run
echo "Stopping the existing run"
$PM2 delete $PROJECT_NAME || echo "No running processes to stop"

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
$PM2 start dist/index.js --name $PROJECT_NAME || { echo "Failed to start application"; exit 1; }

echo "Deployment completed successfully"
