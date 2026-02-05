#!/bin/bash

# Deploy CryptoShorts to GitHub Pages

echo "🚀 Deploying CryptoShorts..."

# Build the app
echo "Building web version..."
npx expo export --platform web --output-dir web-build

# Create a temporary directory for deployment
DEPLOY_DIR=$(mktemp -d)

# Copy build files
cp -r web-build/* $DEPLOY_DIR/

# Initialize git in deploy directory
cd $DEPLOY_DIR
git init
git add -A
git commit -m "Deploy CryptoShorts"

# Create gh-pages branch
git checkout -b gh-pages

echo "✅ Build ready for GitHub Pages deployment!"
echo ""
echo "To complete deployment:"
echo "1. Create a new repository on GitHub: https://github.com/new"
echo "2. Name it: cryptoshorts-app"
echo "3. Run these commands:"
echo ""
echo "cd $DEPLOY_DIR"
echo "git remote add origin https://github.com/vbh1v/cryptoshorts-app.git"
echo "git push -u origin gh-pages"
echo ""
echo "4. Enable GitHub Pages in Settings > Pages > Source: gh-pages"
echo ""
echo "Your app will be live at: https://vbh1v.github.io/cryptoshorts-app/"