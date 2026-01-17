#!/bin/bash

# Check if frontend build exists, if not, build it
if [ ! -d "frontend/dist" ]; then
  echo "🎨 Frontend build not found. Building now... (This only happens once)"
  cd frontend
  npm install
  npm run build
  cd ..
  echo "✅ Frontend build complete!"
else
  echo "⏩ Frontend already built. Skipping build step."
fi

# Run the backend (which serves the frontend)
echo "🚀 Starting Server..."
cd backend
npm install
node server.js
