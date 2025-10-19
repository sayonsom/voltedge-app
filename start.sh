#!/bin/bash

# VoltEdge Application Startup Script
# This script starts the Next.js development server with API routes

echo "🚀 Starting VoltEdge Application..."
echo ""
echo "📦 Installing dependencies if needed..."
npm install

echo ""
echo "🔧 Starting Next.js development server..."
echo "   - Frontend: http://localhost:3000"
echo "   - API Routes: http://localhost:3000/api"
echo ""

npm run dev
