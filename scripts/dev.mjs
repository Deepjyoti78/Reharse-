import { spawn } from 'child_process';

const server = spawn('npx', ['tsx', 'server/index.ts'], { stdio: 'inherit', shell: true });
const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });

function cleanup() {
  try { server.kill(); } catch {}
  try { vite.kill(); } catch {}
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
