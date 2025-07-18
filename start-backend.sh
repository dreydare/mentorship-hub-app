#!/bin/bash

echo "🚀 Starting Mentorship Platform Backend Setup..."

# Navigate to server directory
cd server

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials"
fi

echo "✅ Setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd server"
echo "  npm run start:dev"
echo ""
echo "Swagger API docs will be available at: http://localhost:3100/api"