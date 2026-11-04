import jwt from 'jsonwebtoken';

const SESSION_SECRET = process.env.SESSION_SECRET || 'rehearse-dev-super-secure-jwt-key-2026-local-dev';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body || {};
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Please enter your full name.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const userId = `usr_${Date.now()}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=b8542c&color=fdfaf3&bold=true`;

  const user = {
    id: userId,
    name: cleanName,
    email: cleanEmail,
    avatarUrl,
    status: 'active',
    targetRole: 'Software engineering',
    readinessScore: 78,
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

  return res.status(201).json({ user });
}
