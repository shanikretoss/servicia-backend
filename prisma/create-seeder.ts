import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
let name = args[0];

if (name === '--name' && args[1]) {
  name = args[1];
}

if (!name) {
  console.error('Error: Please provide a name for the seeder.');
  console.error('Usage: npm run db:seed:create -- <seeder-name>');
  process.exit(1);
}

const cleanName = name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();

const now = new Date();
const timestamp = now
  .toISOString()
  .replace(/[^0-9]/g, '')
  .slice(0, 14);

const filename = `${timestamp}_${cleanName}.ts`;
const destFolder = path.join(__dirname, 'seeders');

if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
}

const filepath = path.join(destFolder, filename);

const content = `import { PrismaClient } from '@prisma/client';

export async function up(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Running seeder: ${filename}');
  
  // Implement your idempotent seed logic here
}
`;

fs.writeFileSync(filepath, content);
console.log(`✅ Created seeder: prisma/seeders/${filename}`);
