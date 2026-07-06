import { PrismaClient } from '@prisma/client';

export async function up(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding Roles...');

  const roles = [
    {
      name: 'Owner',
      slug: 'owner',
      description: 'The owner of the company account',
      isSystem: true,
    },
    {
      name: 'Admin',
      slug: 'admin',
      description: 'Company administrator with elevated privileges',
      isSystem: true,
    },
    {
      name: 'Member',
      slug: 'member',
      description: 'Standard company member',
      isSystem: true,
    },
  ];

  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { slug: roleData.slug },
      update: {
        name: roleData.name,
        description: roleData.description,
        isSystem: roleData.isSystem,
      },
      create: roleData,
    });
    console.log(`   - Role: ${role.name} (${role.slug})`);
  }
}
