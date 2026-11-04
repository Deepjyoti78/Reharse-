import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  findUserById,
  findUserByEmail,
  findUserByProviderIdentity,
  createUserWithIdentity,
  linkIdentityToUser,
  updateUserLastLogin,
  UserRow,
} from '../db/users';
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  extractSessionFromRequest,
} from '../services/session';
import {
  createGoogleAuthUrl,
  handleGoogleCallback,
  isGoogleOAuthConfigured,
} from '../services/googleOAuth';
import {
  createGitHubAuthUrl,
  handleGitHubCallback,
  isGitHubOAuthConfigured,
} from '../services/githubOAuth';

export const authRouter = Router();

function getFrontendUrl(): string {
  return process.env.FRONTEND_URL || 'http://localhost:5173';
}

function formatUserResponse(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatar_url,
    status: user.status,
    targetRole: user.target_role,
    readinessScore: user.readiness_score,
    completedSessions: user.completed_sessions,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };
}

/* ================= 1. Configuration & Status ================= */

authRouter.get('/providers', (_req: Request, res: Response) => {
  res.json({
    googleConfigured: isGoogleOAuthConfigured(),
    githubConfigured: isGitHubOAuthConfigured(),
  });
});

/* ================= 2. Current Authenticated User (Session Check) ================= */

authRouter.get('/me', (req: Request, res: Response) => {
  const session = extractSessionFromRequest(req);
  if (!session) {
    // Return 200 with user: null to prevent browser console red error flags on guest visits
    return res.status(200).json({ user: null });
  }

  const user = findUserById(session.userId);
  if (!user || user.status !== 'active') {
    clearSessionCookie(res);
    return res.status(200).json({ user: null });
  }

  res.json({ user: formatUserResponse(user) });
});

/* ================= 3. Email & Password Authentication ================= */

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = findUserByEmail(cleanEmail);

    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = createUserWithIdentity(
      {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        targetRole: 'Software engineering',
        readinessScore: 78,
        completedSessions: 0,
      },
      {
        provider: 'email',
        providerUserId: cleanEmail,
        providerEmail: cleanEmail,
        emailVerified: false,
      }
    );

    const token = createSessionToken(newUser);
    setSessionCookie(res, token);

    return res.status(201).json({ user: formatUserResponse(newUser) });
  } catch (err: unknown) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = findUserByEmail(cleanEmail);

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    updateUserLastLogin(user.id);

    const token = createSessionToken(user);
    setSessionCookie(res, token);

    return res.json({ user: formatUserResponse(user) });
  } catch (err: unknown) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

/* ================= Dev Google Simulation Endpoint (Database Backed) ================= */

authRouter.post('/dev-google-login', async (req: Request, res: Response) => {
  try {
    const { name, email, avatarUrl } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || cleanEmail.split('@')[0]).trim();
    const sub = `google_dev_${Buffer.from(cleanEmail).toString('hex').slice(0, 16)}`;

    let user = findUserByProviderIdentity('google', sub);

    if (user) {
      updateUserLastLogin(user.id);
    } else {
      const existing = findUserByEmail(cleanEmail);
      if (existing) {
        linkIdentityToUser(existing.id, {
          provider: 'google',
          providerUserId: sub,
          providerEmail: cleanEmail,
          emailVerified: true,
        });
        user = existing;
      } else {
        user = createUserWithIdentity(
          {
            name: cleanName,
            email: cleanEmail,
            avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=b8542c&color=fdfaf3&bold=true`,
            targetRole: 'Software engineering',
            readinessScore: 88,
            completedSessions: 0,
          },
          {
            provider: 'google',
            providerUserId: sub,
            providerEmail: cleanEmail,
            emailVerified: true,
          }
        );
      }
    }

    const token = createSessionToken(user);
    setSessionCookie(res, token);

    return res.json({ user: formatUserResponse(user) });
  } catch (err: unknown) {
    console.error('Dev Google login error:', err);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
});

/* ================= 4. Google OAuth 2.0 Flow ================= */

authRouter.get('/google', (req: Request, res: Response) => {
  try {
    const destination = (req.query.destination as string) || '/';
    const authUrl = createGoogleAuthUrl(destination);
    res.redirect(authUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to initiate Google authentication';
    console.error('Google OAuth init error:', message);
    res.redirect(`${getFrontendUrl()}/?auth_error=${encodeURIComponent(message)}`);
  }
});

authRouter.get('/google/callback', async (req: Request, res: Response) => {
  const frontendUrl = getFrontendUrl();

  try {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      console.warn('Google OAuth returned error:', oauthError);
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Google sign-in was cancelled or declined.')}`);
    }

    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Missing authorization code or state parameter.')}`);
    }

    // Exchange code, verify ID token, and extract verified profile
    const { profile, destination } = await handleGoogleCallback(code, state);

    // 1. Check if user already has this Google identity
    let user = findUserByProviderIdentity('google', profile.sub);

    if (user) {
      updateUserLastLogin(user.id);
    } else {
      // 2. Check if user with this verified email already exists
      const existingUserByEmail = findUserByEmail(profile.email);

      if (existingUserByEmail) {
        // Link Google identity to the existing account
        linkIdentityToUser(existingUserByEmail.id, {
          provider: 'google',
          providerUserId: profile.sub,
          providerEmail: profile.email,
          emailVerified: profile.emailVerified,
        });
        user = existingUserByEmail;
      } else {
        // 3. Create brand-new user with Google identity inside a transaction
        user = createUserWithIdentity(
          {
            name: profile.name,
            email: profile.email,
            avatarUrl: profile.picture,
            targetRole: 'Software engineering',
            readinessScore: 88,
            completedSessions: 0,
          },
          {
            provider: 'google',
            providerUserId: profile.sub,
            providerEmail: profile.email,
            emailVerified: profile.emailVerified,
          }
        );
      }
    }

    // Issue session token and secure cookie
    const token = createSessionToken(user);
    setSessionCookie(res, token);

    const userJson = encodeURIComponent(JSON.stringify(formatUserResponse(user)));
    const redirectPath = destination && destination.startsWith('/') ? destination : '/';
    const separator = redirectPath.includes('?') ? '&' : '?';
    res.redirect(`${frontendUrl}${redirectPath}${separator}auth=success&provider=google&user=${userJson}&token=${encodeURIComponent(token)}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Google authentication failed';
    console.error('Google callback error:', message);
    res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(message)}`);
  }
});

/* ================= 5. GitHub OAuth Flow ================= */

authRouter.get('/github', (req: Request, res: Response) => {
  try {
    const destination = (req.query.destination as string) || '/';
    const authUrl = createGitHubAuthUrl(destination);
    res.redirect(authUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to initiate GitHub authentication';
    console.error('GitHub OAuth init error:', message);
    res.redirect(`${getFrontendUrl()}/?auth_error=${encodeURIComponent(message)}`);
  }
});

authRouter.get('/github/callback', async (req: Request, res: Response) => {
  const frontendUrl = getFrontendUrl();

  try {
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      console.warn('GitHub OAuth returned error:', oauthError);
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('GitHub authorization was cancelled or declined.')}`);
    }

    if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Missing authorization code or state parameter.')}`);
    }

    // Exchange code and fetch verified profile
    const { profile, destination } = await handleGitHubCallback(code, state);

    // 1. Check if user already has this GitHub identity
    let user = findUserByProviderIdentity('github', profile.id);

    if (user) {
      updateUserLastLogin(user.id);
    } else {
      // 2. Check if user with this email already exists and email is verified
      const existingUserByEmail = profile.emailVerified ? findUserByEmail(profile.email) : null;

      if (existingUserByEmail) {
        linkIdentityToUser(existingUserByEmail.id, {
          provider: 'github',
          providerUserId: profile.id,
          providerEmail: profile.email,
          emailVerified: profile.emailVerified,
        });
        user = existingUserByEmail;
      } else {
        // 3. Create brand-new user with GitHub identity
        user = createUserWithIdentity(
          {
            name: profile.name,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
            targetRole: 'Software engineering',
            readinessScore: 88,
            completedSessions: 0,
          },
          {
            provider: 'github',
            providerUserId: profile.id,
            providerEmail: profile.email,
            emailVerified: profile.emailVerified,
          }
        );
      }
    }

    // Issue session token and secure cookie
    const token = createSessionToken(user);
    setSessionCookie(res, token);

    const userJson = encodeURIComponent(JSON.stringify(formatUserResponse(user)));
    const redirectPath = destination && destination.startsWith('/') ? destination : '/';
    const separator = redirectPath.includes('?') ? '&' : '?';
    res.redirect(`${frontendUrl}${redirectPath}${separator}auth=success&provider=github&user=${userJson}&token=${encodeURIComponent(token)}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'GitHub authentication failed';
    console.error('GitHub callback error:', message);
    res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(message)}`);
  }
});
