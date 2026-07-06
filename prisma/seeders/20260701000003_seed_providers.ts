import { PrismaClient } from '@prisma/client';

export async function up(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding Providers...');

  const providers = [
    {
      name: 'Stripe',
      slug: 'stripe',
      category: 'payment',
      status: 'active',
    },
    {
      name: 'QuickBooks',
      slug: 'quickbooks',
      category: 'accounting',
      status: 'active',
    },
  ];

  for (const providerData of providers) {
    const provider = await prisma.provider.upsert({
      where: { slug: providerData.slug },
      update: {
        name: providerData.name,
        category: providerData.category,
        status: providerData.status,
      },
      create: providerData,
    });
    console.log(`   - Provider: ${provider.name} (${provider.slug})`);
  }
}
