#!/bin/bash

# Comtech CRM - Quick Start Script

echo "🚀 Starting Comtech CRM..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
NODE_ENV=development
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=comtech_crm
MYSQL_USER=comtech
MYSQL_PASSWORD=comtech123
API_PORT=3001
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001
KEYCLOAK_URL=https://sso.clicksbiz.com/
KEYCLOAK_REALM=SCGJWD-Portal
KEYCLOAK_CLIENT_ID=DynamicAppDev
EOF
fi

# Start services
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Comtech CRM is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API:      http://localhost:3001"
echo "🗄️  MySQL:    localhost:3306"
echo "💾 Redis:    localhost:6379"
echo ""
echo "📋 View logs: docker-compose logs -f"
echo "🛑 Stop:      docker-compose down"
