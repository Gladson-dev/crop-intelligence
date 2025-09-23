#!/bin/bash

# Exit on error
set -e

echo "=== Starting Frontend Build ==="

# Print environment information
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Clean up
echo "Cleaning up..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Install Vite explicitly
echo "Ensuring Vite is installed..."
npm install --save-dev vite@5.0.0

# Verify Vite installation
VITE_VERSION=$(npx vite --version 2>&1 || echo "Vite not found")
echo "Vite version: $VITE_VERSION"

# Build the application
echo "Building the application..."
npm run build

# Verify build output
echo "Build output:"
ls -la dist/

echo "=== Build completed successfully ==="
exit 0
