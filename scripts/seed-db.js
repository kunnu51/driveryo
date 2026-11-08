// Database Seeding Script for DRIVERYO
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Driveryo database...');

  // 1. Create Default City (Hyderabad)
  const hyd = await prisma.city.upsert({
    where: { name: 'Hyderabad' },
    update: {},
    create: {
      name: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      latitude: 17.385044,
      longitude: 78.486671,
      isActive: true,
    },
  });
  console.log(`✅ City created: ${hyd.name}`);

  // 2. Create Service Types
  const services = [
    { category: 'INSTANT', name: 'Instant Driver', description: 'Dispatched immediately within 10-15 mins', sortOrder: 1 },
    { category: 'SCHEDULED', name: 'Scheduled Driver', description: 'Advance booking for appointments or flights', sortOrder: 2 },
    { category: 'DAILY', name: 'Daily Chauffeur (8h)', description: 'Full day 8-hour errand and city travel package', sortOrder: 3 },
    { category: 'OUTSTATION', name: 'Outstation Road Trip', description: 'Intercity getaways and highway journeys', sortOrder: 4 },
    { category: 'MONTHLY', name: 'Monthly Chauffeur', description: '26-day daily office commute pass', sortOrder: 5 },
    { category: 'CORPORATE', name: 'Corporate Account', description: 'Centralized enterprise billing and dedicated chauffeurs', sortOrder: 6 },
  ];

  for (const s of services) {
    const srv = await prisma.serviceType.upsert({
      where: { category: s.category },
      update: {},
      create: s,
    });

    // 3. Create Pricing Rules for each service in Hyderabad
    let baseFare = 349, includedHours = 2, hourlyRate = 149;
    if (s.category === 'SCHEDULED') { baseFare = 399; }
    else if (s.category === 'DAILY') { baseFare = 1199; includedHours = 8; hourlyRate = 129; }
    else if (s.category === 'OUTSTATION') { baseFare = 1899; includedHours = 12; hourlyRate = 159; }
    else if (s.category === 'MONTHLY') { baseFare = 24999; includedHours = 208; hourlyRate = 120; }
    else if (s.category === 'CORPORATE') { baseFare = 1299; includedHours = 9; hourlyRate = 130; }

    await prisma.pricingRule.upsert({
      where: {
        cityId_serviceTypeId: {
          cityId: hyd.id,
          serviceTypeId: srv.id,
        },
      },
      update: {},
      create: {
        cityId: hyd.id,
        serviceTypeId: srv.id,
        baseFare,
        includedHours,
        hourlyRate,
        waitingRatePerMin: 2.0,
        nightSurchargePct: 25.0,
        cancellationFee: 99.0,
        driverCommissionPct: 20.0,
      },
    });
  }
  console.log('✅ Service types and pricing rules populated');

  // 4. Create Promo Codes
  await prisma.promoCode.upsert({
    where: { code: 'FIRSTTRIP' },
    update: {},
    create: {
      code: 'FIRSTTRIP',
      description: 'Flat ₹100 discount on your first driver booking',
      flatDiscount: 100.0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000),
    },
  });
  console.log('✅ Promo code FIRSTTRIP seeded');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
