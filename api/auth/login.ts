import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rehearse-dev-super-secure-jwt-key-2026-local-dev';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();

  // Determine user profile (demo or custom)
  let name = 'User';
  let targetRole = 'Software engineering';
  let readinessScore = 85;
  let completedSessions = 3;

  if (cleanEmail === 'demo@rehearse.ai') {
    name = 'Aman Verma';
    targetRole = 'Software engineering';
    readinessScore = 94;
    completedSessions = 8;
  } else {
    const prefix = cleanEmail.split('@')[0] || 'User';
    name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b8542c&color=fdfaf3&bold=true`;

  const user = {
    id: `usr_${Date.now()}`,
    name,
    email: cleanEmail,
    avatarUrl,
    status: 'active',
    targetRole,
    readinessScore,
    completedSessions,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      provider: 'email',
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
