import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rehearse-dev-super-secure-jwt-key-2026-local-dev';

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

export default function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');

  const cookies = parseCookies(req.headers?.cookie);
  const token = cookies.rehearse_session;

  if (!token) {
    // Return 200 with { user: null } instead of 401/404 to avoid console errors
    return res.status(200).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, SESSION_SECRET) as any;
    return res.status(200).json({
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        avatarUrl: decoded.avatarUrl,
        provider: decoded.provider || 'email',
        status: 'active',
        targetRole: decoded.targetRole || 'Software engineering',
        readinessScore: decoded.readinessScore || 78,
        completedSessions: decoded.completedSessions || 0,
      },
    });
  } catch {
    return res.status(200).json({ user: null });
  }
}

