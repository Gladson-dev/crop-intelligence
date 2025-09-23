#!/bin/bash

# Exit on error
set -e

echo "=== Starting Frontend Build ==="

# Print environment information
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Clean up
echo "Cleaning up previous installations..."
rm -rf node_modules
rm -f package-lock.json

# Install specific npm version
echo "Updating npm to version 10.2.4..."
npm install -g npm@10.2.4

# Install Vite globally
echo "Installing Vite globally..."
npm install -g vite@5.0.0

# Install project dependencies
echo "Installing project dependencies..."
npm install --legacy-peer-deps

# Install Vite as dev dependency
echo "Installing Vite locally..."
npm install --save-dev vite@5.0.0

# Verify installations
echo "Verifying installations..."
echo "Vite version: $(npx vite --version)"

# Build the application
echo "Building the application..."
npm run build

# Verify build output
echo "Build output:"
ls -la dist/

echo "=== Build completed successfully ==="
exit 0
