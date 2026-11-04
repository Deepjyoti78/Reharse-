export default function handler(req: any, res: any) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const destination = (req.query?.destination as string) || '/';
  
  if (!clientId) {
    // Redirect to frontend with dialog trigger if credentials not configured on Vercel
    return res.redirect(`/?google_dialog=true&destination=${encodeURIComponent(destination)}`);
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${proto}://${host}/api/auth/google/callback`;

  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

