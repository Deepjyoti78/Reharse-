import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rehearse-dev-super-secure-jwt-key-2026-local-dev';

export default async function handler(req: any, res: any) {
  const { code, state, error: oauthError } = req.query || {};

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const frontendUrl = `${proto}://${host}`;

  if (oauthError) {
    return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Google sign in was cancelled.')}`);
  }

  if (!code) {
    return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent('Missing authorization code.')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${frontendUrl}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      throw new Error('Failed to exchange Google authorization code');
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!tokenInfoRes.ok) {
      throw new Error('Failed to verify Google ID token');
    }

    const payload = await tokenInfoRes.json();
    const user = {
      id: `usr_g_${payload.sub}`,
      name: payload.name || payload.email?.split('@')[0] || 'Google User',
      email: payload.email,
      avatarUrl: payload.picture || null,
      provider: 'google',
      status: 'active',
      targetRole: 'Software engineering',
      readinessScore: 88,
      completedSessions: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        provider: 'google',
        targetRole: user.targetRole,
        readinessScore: user.readinessScore,
        completedSessions: user.completedSessions,
      },
      SESSION_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader(
      'Set-Cookie',
      `rehearse_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 86400}`
    );

    const userJson = encodeURIComponent(JSON.stringify(user));
    return res.redirect(`${frontendUrl}/?auth=success&provider=google&user=${userJson}&token=${encodeURIComponent(token)}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Google authentication failed';
    return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(msg)}`);
  }
}

