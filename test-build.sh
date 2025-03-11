#!/bin/bash
# Clean up previous build
rm -rf dist
rm -rf client/dist

# Run the deployment script
bash deployment.sh

# Check if the build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful! Testing the build..."
    # Serve the built files locally
    npx serve dist
else
    echo "❌ Build failed!"
    # Restore the original files
    mv client/src/App.tsx.backup client/src/App.tsx
fi 