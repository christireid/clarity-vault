-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant all privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE prompt_vault TO postgres;
