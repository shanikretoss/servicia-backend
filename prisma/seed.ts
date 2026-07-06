import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting Database Seed Execution...');

  const seedersFolder = path.join(__dirname, 'seeders');
  if (!fs.existsSync(seedersFolder)) {
    console.log('⚠️ No seeders folder found. Seeding skipped.');
    return;
  }

  const seederFiles = fs
    .readdirSync(seedersFolder)
    .filter(
      (file) =>
        (file.endsWith('.ts') || file.endsWith('.js')) &&
        !file.endsWith('.d.ts'),
    )
    .sort();

  if (seederFiles.length === 0) {
    console.log('⚠️ No seeder files found. Seeding skipped.');
    return;
  }

  for (const filename of seederFiles) {
    const filePath = path.join(seedersFolder, filename);
    console.log(`▶️ Executing seeder: ${filename}`);

    const seederModule = (await import(filePath)) as {
      up?: (prisma: PrismaClient) => Promise<void>;
    };

    if (typeof seederModule.up === 'function') {
      await seederModule.up(prisma);
      console.log(`✅ Finished: ${filename}\n`);
    } else {
      console.warn(
        `⚠️ Warning: ${filename} does not export an 'up' function.\n`,
      );
    }
  }

  console.log('🎉 Database Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding execution failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
