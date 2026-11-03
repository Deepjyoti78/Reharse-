import { generateRandomString, generateCodeChallenge } from './session';
import { saveOAuthState, consumeOAuthState } from '../db/users';

export interface GoogleConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getGoogleConfig(): GoogleConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

  return { clientId, clientSecret, redirectUri };
}

export function isGoogleOAuthConfigured(): boolean {
  const { clientId, clientSecret } = getGoogleConfig();
  return Boolean(clientId && clientSecret);
}

/**
 * Initiates Google OAuth with PKCE and OIDC Nonce
 */
export function createGoogleAuthUrl(destination: string = '/'): string {
  const { clientId, redirectUri } = getGoogleConfig();

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in the environment.');
  }

  const state = generateRandomString(32);
  const nonce = generateRandomString(32);
  const codeVerifier = generateRandomString(48);
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Persist state, verifier, and nonce in database (expires in 10 minutes)
  saveOAuthState({
    state,
    provider: 'google',
    codeVerifier,
    nonce,
    destination,
    expiresInMinutes: 10,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'online',
    prompt: 'select_account',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  emailVerified: boolean;
  picture: string | null;
}

/**
 * Validates Google OAuth callback, exchanges authorization code, and verifies ID Token
 */
export async function handleGoogleCallback(
  code: string,
  state: string
): Promise<{ profile: GoogleProfile; destination: string }> {
  const { clientId, clientSecret, redirectUri } = getGoogleConfig();

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials are not fully configured.');
  }

  // 1. Consume and validate transient OAuth state
  const stateRecord = consumeOAuthState(state, 'google');
  if (!stateRecord) {
    throw new Error('Invalid or expired OAuth state parameter. Please try logging in again.');
  }

  if (!stateRecord.code_verifier) {
    throw new Error('Missing PKCE code verifier for OAuth state.');
  }

  // 2. Exchange authorization code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      code_verifier: stateRecord.code_verifier,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`Google token exchange failed (${tokenResponse.status}): ${errorBody}`);
  }

  const tokenData = await tokenResponse.json();
  const idToken = tokenData.id_token;

  if (!idToken) {
    throw new Error('Google did not return an identity token (id_token).');
  }

  // 3. Verify ID Token with Google's tokeninfo endpoint to validate signature & claims
  const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);

  if (!tokenInfoResponse.ok) {
    const errorBody = await tokenInfoResponse.text();
    throw new Error(`Google ID token verification failed: ${errorBody}`);
  }

  const payload = await tokenInfoResponse.json();

  // 4. Validate audience, issuer, expiration, and nonce
  if (payload.aud !== clientId) {
    throw new Error(`Google ID token audience mismatch. Expected ${clientId}, got ${payload.aud}`);
  }

  const validIssuers = ['https://accounts.google.com', 'accounts.google.com'];
  if (!validIssuers.includes(payload.iss)) {
    throw new Error(`Google ID token issuer mismatch: ${payload.iss}`);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (Number(payload.exp) < nowSec) {
    throw new Error('Google ID token has expired.');
  }

  if (stateRecord.nonce && payload.nonce && payload.nonce !== stateRecord.nonce) {
    throw new Error('Google ID token nonce mismatch. Potential replay attempt.');
  }

  if (!payload.email) {
    throw new Error('Google account does not have an associated email address.');
  }

  const profile: GoogleProfile = {
    sub: payload.sub,
    name: payload.name || payload.email.split('@')[0],
    email: payload.email,
    emailVerified: payload.email_verified === 'true' || payload.email_verified === true,
    picture: payload.picture || null,
  };

  return {
    profile,
    destination: stateRecord.destination || '/',
  };
}
