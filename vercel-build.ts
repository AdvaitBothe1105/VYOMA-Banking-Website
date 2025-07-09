// vercel-build.js
const { execSync } = require('child_process');

try {
  console.log('Running `prisma generate`...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to run `prisma generate`:', error);
  process.exit(1);
}
