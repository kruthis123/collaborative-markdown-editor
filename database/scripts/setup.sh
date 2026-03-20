#!/bin/bash

export $(cat "./.env" | grep -v '^#' | xargs)

echo "🔧 Setting up database schema for users table..."

# Check if PostgreSQL container is running
if ! docker ps | grep -q postgres; then
    echo "❌ PostgreSQL container is not running. Please start it first:"
    echo "   docker-compose up"
    exit 1
fi

# Run the setup scripts
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f setup-users-table.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f setup-documents-table.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
else
    echo "❌ Failed to setup database"
    exit 1
fi
