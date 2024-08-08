## Installation

```bash
$ npm install
```

## Restore the database

```bash
# Create the database
$ psql -U postgres -h localhost -p 5433 -c "CREATE DATABASE racquet_store_db_graph;"

# Restore database information
$ psql -U postgres -d racquet_store_db_graph -h localhost -p 5433 -f racquet_store_db_graph_plain.sql
```

## Running the app

```bash
# development
$ npm run start

```