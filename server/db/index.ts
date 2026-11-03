import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'rehearse.db');
export const db = new Database(dbPath);

// Enable WAL mode for high concurrency & performance
db.pragma('journal_mode = WAL');
// Enforce referential integrity
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      avatar_url TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      target_role TEXT DEFAULT 'Software engineering',
      readiness_score INTEGER DEFAULT 78,
      completed_sessions INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      last_login_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- 2. Authentication Identities Table
    CREATE TABLE IF NOT EXISTS auth_identities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_user_id TEXT NOT NULL,
      provider_email TEXT,
      email_verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(provider, provider_user_id)
    );

    CREATE INDEX IF NOT EXISTS idx_identities_user_id ON auth_identities(user_id);
    CREATE INDEX IF NOT EXISTS idx_identities_provider ON auth_identities(provider, provider_user_id);

    -- 3. OAuth Transient States & PKCE Table
    CREATE TABLE IF NOT EXISTS oauth_states (
      state TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      code_verifier TEXT,
      nonce TEXT,
      destination TEXT,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON oauth_states(expires_at);
  `);

  console.log('Database initialized successfully at:', dbPath);
}
