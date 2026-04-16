#!/bin/bash

# sync-env-from-example.sh
# Creates/updates .env files in each service directory based on .env.example files
# Usage: ./scripts/sync-env-from-example.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔧 Syncing .env files from .env.example templates..."

# Function to sync env file
sync_env() {
    local source_file="$1"
    local target_file="$2"
    local service_name="$3"

    if [ ! -f "$source_file" ]; then
        echo "⚠️  $service_name: .env.example not found at $source_file (skipping)"
        return
    fi

    if [ -f "$target_file" ]; then
        echo "✓ $service_name: .env already exists (no changes)"
    else
        cp "$source_file" "$target_file"
        echo "✓ $service_name: .env created from .env.example"
    fi
}

# Root .env
sync_env "$REPO_ROOT/.env.example" "$REPO_ROOT/.env" "Root"

# Frontend services
sync_env "$REPO_ROOT/expo-mobile/.env.example" "$REPO_ROOT/expo-mobile/.env" "Expo Mobile"
sync_env "$REPO_ROOT/web-nextjs/.env.example" "$REPO_ROOT/web-nextjs/.env.local" "Next.js"
sync_env "$REPO_ROOT/web-react/.env.example" "$REPO_ROOT/web-react/.env" "React SPA"

# Backend services
sync_env "$REPO_ROOT/backend-nestjs/.env.example" "$REPO_ROOT/backend-nestjs/.env" "NestJS"
sync_env "$REPO_ROOT/backend-fastapi/.env.example" "$REPO_ROOT/backend-fastapi/.env" "FastAPI"
sync_env "$REPO_ROOT/backend-rails/.env.example" "$REPO_ROOT/backend-rails/.env" "Rails"
sync_env "$REPO_ROOT/backend-phoenix/.env.example" "$REPO_ROOT/backend-phoenix/.env" "Phoenix"

echo ""
echo "✅ Environment variable setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review and update .env files with your local configuration"
echo "   2. For secrets: use strong, random values (never commit these)"
echo "   3. Run: docker compose up --build"
echo ""
echo "💡 Tip: Keep .env.example committed with defaults only; never add real secrets to .env.example"
