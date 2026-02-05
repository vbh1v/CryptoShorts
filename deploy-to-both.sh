#!/bin/bash

echo "🚀 Deploying to both Vercel accounts..."

# Build the project
npm run build

# Deploy to Vaibhav's account
echo "Deploying to Vaibhav's Vercel..."
VERCEL_TOKEN="KzKHZyM10H9JcBnNNbmereaH" npx vercel --prod --yes

# Deploy to Sudesh's account
echo "Deploying to Sudesh's Vercel..."
VERCEL_TOKEN="SUDESH_TOKEN_HERE" npx vercel --prod --yes

echo "✅ Both deployments complete!"