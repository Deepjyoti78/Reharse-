export default function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    googleConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
    githubConfigured: Boolean(process.env.GITHUB_CLIENT_ID),
  });
}
