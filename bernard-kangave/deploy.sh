#!/bin/bash

# Stop on first error
set -e

echo "🚀 Starting deployment for Bernard Kangave Website..."

# 1. Build the Next.js application
echo "📦 Building the application..."
npm run build

# 2. Deploy to Firebase App Hosting
echo "🔥 Deploying to Firebase..."
npx --yes firebase-tools@latest deploy

echo "✅ Deployment complete!"
