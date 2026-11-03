import { generateRandomString } from './session';
import { saveOAuthState, consumeOAuthState } from '../db/users';

export interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getGitHubConfig(): GitHubConfig {
  const clientId = process.env.GITHUB_CLIENT_ID || '';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/github/callback';

  return { clientId, clientSecret, redirectUri };
}

export function isGitHubOAuthConfigured(): boolean {
  const { clientId, clientSecret } = getGitHubConfig();
  return Boolean(clientId && clientSecret);
}

/**
 * Initiates GitHub OAuth authorization flow
 */
export function createGitHubAuthUrl(destination: string = '/'): string {
  const { clientId, redirectUri } = getGitHubConfig();

  if (!clientId) {
    throw new Error('GITHUB_CLIENT_ID is not configured in the environment.');
  }

  const state = generateRandomString(32);

  // Persist state in database (expires in 10 minutes)
  saveOAuthState({
    state,
    provider: 'github',
    destination,
    expiresInMinutes: 10,
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state,
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export interface GitHubProfile {
  id: string;
  login: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatarUrl: string | null;
}

interface GitHubEmailItem {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

/**
 * Exchanges authorization code for access token and retrieves verified GitHub user profile
 */
export async function handleGitHubCallback(
  code: string,
  state: string
): Promise<{ profile: GitHubProfile; destination: string }> {
  const { clientId, clientSecret, redirectUri } = getGitHubConfig();

  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth credentials are not fully configured.');
  }

  // 1. Consume and validate transient OAuth state
  const stateRecord = consumeOAuthState(state, 'github');
  if (!stateRecord) {
    throw new Error('Invalid or expired OAuth state parameter. Please try logging in again.');
  }

  // 2. Exchange authorization code for access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`GitHub token exchange failed (${tokenResponse.status}): ${errorBody}`);
  }

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    throw new Error(`GitHub token error: ${tokenData.error_description || tokenData.error}`);
  }

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    throw new Error('GitHub did not return an access token.');
  }

  // 3. Fetch user profile from GitHub API
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Rehearse-App',
      Accept: 'application/vnd.github+json',
    },
  });

  if (!userResponse.ok) {
    const errorBody = await userResponse.text();
    throw new Error(`Failed to fetch GitHub user (${userResponse.status}): ${errorBody}`);
  }

  const userData = await userResponse.json();

  // 4. Fetch user email addresses from GitHub emails API (handles private emails)
  let resolvedEmail = userData.email;
  let isEmailVerified = false;

  const emailsResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'Rehearse-App',
      Accept: 'application/vnd.github+json',
    },
  });

  if (emailsResponse.ok) {
    const emails: GitHubEmailItem[] = await emailsResponse.json();

    if (Array.isArray(emails) && emails.length > 0) {
      // Find primary verified email
      const primaryVerified = emails.find((e) => e.primary && e.verified);
      const anyVerified = emails.find((e) => e.verified);
      const anyPrimary = emails.find((e) => e.primary);

      const bestMatch = primaryVerified || anyVerified || anyPrimary || emails[0];
      if (bestMatch) {
        resolvedEmail = bestMatch.email;
        isEmailVerified = Boolean(bestMatch.verified);
      }
    }
  }

  // Fallback to noreply address if no public or private email is provided
  if (!resolvedEmail) {
    resolvedEmail = `${userData.login}@users.noreply.github.com`;
    isEmailVerified = false;
  }

  const profile: GitHubProfile = {
    id: String(userData.id),
    login: userData.login,
    name: userData.name || userData.login,
    email: resolvedEmail,
    emailVerified: isEmailVerified,
    avatarUrl: userData.avatar_url || null,
  };

  return {
    profile,
    destination: stateRecord.destination || '/',
  };
}

