#!/bin/bash

PSQL="/c/Program Files/PostgreSQL/17/bin/psql.exe"

echo " Setting up BOOK CATALOG DB....."

# Create database
"$PSQL" -U postgres -h localhost -c "CREATE DATABASE book_catalog;"

# Run migrations 
"$PSQL" -U postgres -h localhost -d book_catalog -f src/database/migration/init.sql

# CREATE stored procedures
"$PSQL" -U postgres -h localhost -d book_catalog -f src/database/procedures/sp_create_book.sql
"$PSQL" -U postgres -h localhost -d book_catalog -f src/database/procedures/sp_get_book.sql
"$PSQL" -U postgres -h localhost -d book_catalog -f src/database/procedures/sp_update_book.sql
"$PSQL" -U postgres -h localhost -d book_catalog -f src/database/procedures/sp_delete_book.sql

echo "DATABASE setup complete..."

echo " You can now run : npm run start:dev"