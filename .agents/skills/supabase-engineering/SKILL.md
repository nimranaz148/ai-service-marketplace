---
name: supabase-engineering
description: >-
  Supabase Cloud PostgreSQL integration, connection pooling, RLS security policies,
  realtime subscriptions, and database indexing.
---

# Supabase Engineering & Database Foundations

Use this skill when managing Supabase cloud database schemas, indexing, pooling, and realtime sync.

## Database Standards

### 1. Connection Pooling & Modes
- Use port 6543 for Transaction Pooler (serverless/ephemeral connections).
- Use port 5432 for Session Pooler (Alembic migrations & long-lived connections).
- Always include `?sslmode=require` for secure cloud transport.

### 2. Indexing & Security (RLS)
- Create targeted composite indexes on foreign keys and search filters (`category`, `session_id`, `user_id`).
- Enable Row-Level Security (RLS) on sensitive user and booking tables.
