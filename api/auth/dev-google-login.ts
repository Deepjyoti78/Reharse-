import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rehearse-dev-super-secure-jwt-key-2026-local-dev';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, avatarUrl } = req.body || {};
  const cleanName = String(name || 'Google User').trim();
  const cleanEmail = String(email || 'user@gmail.com').trim().toLowerCase();

  const user = {
    id: `usr_google_${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    avatarUrl: avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=b8542c&color=ffffff&bold=true`,
    status: 'active',
    targetRole: 'Full Stack Engineer',
    readinessScore: 92,
    completedSessions: 4,
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

  return res.status(200).json({ user });
}
