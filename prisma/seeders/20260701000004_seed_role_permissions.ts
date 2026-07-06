import { PrismaClient } from '@prisma/client';

export async function up(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding Role Permissions...');

  // 1. Fetch all seeded roles
  const ownerRole = await prisma.role.findUnique({ where: { slug: 'owner' } });
  const adminRole = await prisma.role.findUnique({ where: { slug: 'admin' } });
  const memberRole = await prisma.role.findUnique({ where: { slug: 'member' } });

  if (!ownerRole || !adminRole || !memberRole) {
    console.error('⚠️ Required roles not found. Skipping role permissions seeding.');
    return;
  }

  // 2. Fetch all seeded permissions
  const allPermissions = await prisma.permission.findMany();

  // Helper function to link a permission to a role idempotently
  const linkRolePermission = async (roleId: string, permissionId: string) => {
    const existing = await prisma.rolePermission.findFirst({
      where: { roleId, permissionId },
    });
    if (!existing) {
      await prisma.rolePermission.create({
        data: { roleId, permissionId },
      });
    }
  };

  // 3. Associate permissions:
  // - Owner and Admin get all permissions
  for (const perm of allPermissions) {
    await linkRolePermission(ownerRole.id, perm.id);
    await linkRolePermission(adminRole.id, perm.id);
  }

  // - Member gets permissions on specific standard modules: auth, users, companies, connected_accounts
  const memberModules = ['auth', 'users', 'companies', 'connected_accounts'];
  const memberPermissions = allPermissions.filter((perm) =>
    memberModules.includes(perm.module),
  );

  for (const perm of memberPermissions) {
    await linkRolePermission(memberRole.id, perm.id);
  }

  // Also assign specific permissions for membership read to Member role
  const membershipReadPerm = allPermissions.find(
    (perm) => perm.module === 'membership' && perm.action === 'read',
  );
  if (membershipReadPerm) {
    await linkRolePermission(memberRole.id, membershipReadPerm.id);
  }

  // Also assign specific permissions for organization read to Member role
  const organizationReadPerm = allPermissions.find(
    (perm) => perm.module === 'organization' && perm.action === 'read',
  );
  if (organizationReadPerm) {
    await linkRolePermission(memberRole.id, organizationReadPerm.id);
  }

  console.log('✅ Finished Seeding Role Permissions');
}
