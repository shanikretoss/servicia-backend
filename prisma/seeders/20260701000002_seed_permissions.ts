import { PrismaClient } from '@prisma/client';

export async function up(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding Permissions...');

  const permissions = [
    { module: 'auth', action: '*' },
    { module: 'users', action: '*' },
    { module: 'companies', action: '*' },
    { module: 'memberships', action: '*' },
    { module: 'roles', action: '*' },
    { module: 'permissions', action: '*' },
    { module: 'providers', action: '*' },
    { module: 'connected_accounts', action: '*' },
    { module: 'audit_logs', action: '*' },
  ];

  for (const permData of permissions) {
    const permission = await prisma.permission.upsert({
      where: {
        module_action: {
          module: permData.module,
          action: permData.action,
        },
      },
      update: {},
      create: permData,
    });
    console.log(`   - Permission: ${permission.module}.${permission.action}`);
  }
}
