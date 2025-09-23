#!/bin/bash

# Exit on error
set -e

echo "=== Starting Frontend Build ==="

# Print environment information
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install specific npm version if needed
# npm install -g npm@10.2.4

# Clean up
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Ensure Vite is installed
echo "Ensuring Vite is installed..."
npm install vite@5.0.0 --save-dev

# Verify Vite installation
npx vite --version

# Build the application
echo "Building the application..."
npm run build

echo "=== Build completed successfully ==="
