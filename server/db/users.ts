import { db } from './index';
import crypto from 'crypto';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string | null;
  avatar_url: string | null;
  status: string;
  target_role: string;
  readiness_score: number;
  completed_sessions: number;
  created_at: string;
  updated_at: string;
  last_login_at: string;
}

export interface AuthIdentityRow {
  id: string;
  user_id: string;
  provider: 'google' | 'github' | 'email';
  provider_user_id: string;
  provider_email: string | null;
  email_verified: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash?: string | null;
  avatarUrl?: string | null;
  targetRole?: string;
  readinessScore?: number;
  completedSessions?: number;
}

export interface CreateIdentityData {
  provider: 'google' | 'github' | 'email';
  providerUserId: string;
  providerEmail?: string | null;
  emailVerified?: boolean;
}

export function findUserById(id: string): UserRow | null {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return (stmt.get(id) as UserRow) || null;
}

export function findUserByEmail(email: string): UserRow | null {
  const stmt = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)');
  return (stmt.get(email.trim()) as UserRow) || null;
}

export function findUserByProviderIdentity(provider: string, providerUserId: string): UserRow | null {
  const stmt = db.prepare(`
    SELECT u.* FROM users u
    JOIN auth_identities i ON u.id = i.user_id
    WHERE i.provider = ? AND i.provider_user_id = ?
  `);
  return (stmt.get(provider, providerUserId) as UserRow) || null;
}

export function findIdentitiesByUserId(userId: string): AuthIdentityRow[] {
  const stmt = db.prepare('SELECT * FROM auth_identities WHERE user_id = ?');
  return (stmt.all(userId) as AuthIdentityRow[]) || [];
}

export function updateUserLastLogin(userId: string): void {
  const now = new Date().toISOString();
  db.prepare('UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?').run(now, now, userId);
}

/**
 * Creates a new user and an associated authentication identity atomically inside a transaction
 */
export const createUserWithIdentity = db.transaction((userData: CreateUserData, identityData: CreateIdentityData): UserRow => {
  const now = new Date().toISOString();
  const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
  const identityId = `ident_${crypto.randomBytes(12).toString('hex')}`;

  const defaultAvatar = userData.avatarUrl || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=b8542c&color=fdfaf3&bold=true`;

  // 1. Insert User
  db.prepare(`
    INSERT INTO users (
      id, name, email, password_hash, avatar_url, status, target_role,
      readiness_score, completed_sessions, created_at, updated_at, last_login_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    userId,
    userData.name.trim(),
    userData.email.trim().toLowerCase(),
    userData.passwordHash || null,
    defaultAvatar,
    'active',
    userData.targetRole || 'Software engineering',
    userData.readinessScore || 78,
    userData.completedSessions || 0,
    now,
    now,
    now
  );

  // 2. Insert Identity
  db.prepare(`
    INSERT INTO auth_identities (
      id, user_id, provider, provider_user_id, provider_email, email_verified, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    identityId,
    userId,
    identityData.provider,
    identityData.providerUserId,
    identityData.providerEmail ? identityData.providerEmail.toLowerCase() : null,
    identityData.emailVerified ? 1 : 0,
    now,
    now
  );

  return findUserById(userId)!;
});

/**
 * Links a new authentication identity to an existing user account inside a transaction
 */
export const linkIdentityToUser = db.transaction((userId: string, identityData: CreateIdentityData): void => {
  const now = new Date().toISOString();
  const identityId = `ident_${crypto.randomBytes(12).toString('hex')}`;

  db.prepare(`
    INSERT INTO auth_identities (
      id, user_id, provider, provider_user_id, provider_email, email_verified, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    identityId,
    userId,
    identityData.provider,
    identityData.providerUserId,
    identityData.providerEmail ? identityData.providerEmail.toLowerCase() : null,
    identityData.emailVerified ? 1 : 0,
    now,
    now
  );

  db.prepare('UPDATE users SET updated_at = ?, last_login_at = ? WHERE id = ?').run(now, now, userId);
});

/* ================= OAuth State Management (CSRF & PKCE & Nonce) ================= */

export interface OAuthStateRecord {
  state: string;
  provider: string;
  code_verifier: string | null;
  nonce: string | null;
  destination: string | null;
  expires_at: number;
}

export function saveOAuthState(record: {
  state: string;
  provider: string;
  codeVerifier?: string;
  nonce?: string;
  destination?: string;
  expiresInMinutes?: number;
}): void {
  // Prune expired states first
  const now = Date.now();
  db.prepare('DELETE FROM oauth_states WHERE expires_at < ?').run(now);

  const expiresAt = now + (record.expiresInMinutes || 10) * 60 * 1000;

  db.prepare(`
    INSERT INTO oauth_states (state, provider, code_verifier, nonce, destination, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    record.state,
    record.provider,
    record.codeVerifier || null,
    record.nonce || null,
    record.destination || null,
    expiresAt
  );
}

export function consumeOAuthState(state: string, provider: string): OAuthStateRecord | null {
  const now = Date.now();
  // Fetch matching state
  const stmt = db.prepare('SELECT * FROM oauth_states WHERE state = ? AND provider = ?');
  const record = stmt.get(state, provider) as OAuthStateRecord | undefined;

  if (!record) {
    return null;
  }

  // Delete immediately so state cannot be reused (replay protection)
  db.prepare('DELETE FROM oauth_states WHERE state = ?').run(state);

  // Check expiration
  if (record.expires_at < now) {
    return null;
  }

  return record;
}
