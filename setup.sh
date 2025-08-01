#!/bin/bash

echo "🚀 Setting up Business Case Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file and add your OpenAI API key"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
mkdir -p uploads

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file and add your OpenAI API key"
echo "2. Start MongoDB (if using local database)"
echo "3. Run 'npm run dev' to start the application"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🎯 The platform will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001" 