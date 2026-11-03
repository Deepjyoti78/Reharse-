import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { Response, Request } from 'express';
import type { UserRow } from '../db/users';

const SESSION_COOKIE_NAME = 'rehearse_session';
const SESSION_DURATION_DAYS = 7;

export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'rehearse-super-secret-jwt-key-2026-production';
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  targetRole: string;
  readinessScore: number;
  completedSessions: number;
}

export function createSessionToken(user: UserRow): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url,
    targetRole: user.target_role,
    readinessScore: user.readiness_score,
    completedSessions: user.completed_sessions,
  };

  return jwt.sign(payload, getSessionSecret(), {
    expiresIn: `${SESSION_DURATION_DAYS}d`,
  });
}

export function setSessionCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAgeMs = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeMs,
  });
}

export function clearSessionCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getSessionSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export function extractSessionFromRequest(req: Request): SessionPayload | null {
  // Check signed HTTP-only cookie first
  const cookieToken = req.cookies?.[SESSION_COOKIE_NAME];
  if (cookieToken) {
    const verified = verifySessionToken(cookieToken);
    if (verified) return verified;
  }

  // Check Authorization Bearer header fallback
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7);
    return verifySessionToken(headerToken);
  }

  return null;
}

/* ================= Cryptographic OAuth Security Helpers ================= */

export function generateRandomString(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * PKCE (Proof Key for Code Exchange) Code Challenge Generator (RFC 7636)
 */
export function generateCodeChallenge(verifier: string): string {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

