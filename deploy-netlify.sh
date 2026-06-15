#!/bin/bash
# Build the frontend for Netlify. Upload the build/ folder if deploying manually.
set -e
cd "$(dirname "$0")/frontend"
echo "Building production app..."
npm run build
echo ""
echo "✅ Build ready at: $(pwd)/build"
echo ""
echo "Netlify options:"
echo "  1) Git deploy: push to GitHub — Netlify builds automatically (netlify.toml is configured)"
echo "  2) Manual deploy: drag the 'build' folder contents to Netlify → Deploys → Deploy manually"
