#!/bin/bash

# FastTrack Agent Setup Script for Mac
echo "🚀 Setting up FastTrack AI Agent..."

# Navigate to the project directory
cd "$(dirname "$0")"

# Check Python version
echo "📋 Checking Python version..."
python3 --version

# Create virtual environment
echo "🔧 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "📦 Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and add your Azure OpenAI credentials"
echo "2. Add PDF documents to the 'kb' folder (optional)"
echo "3. Run: source venv/bin/activate"
echo "4. Run: python src/main.py"
echo ""
echo "🌐 The server will start on http://127.0.0.1:8080"
echo ""
