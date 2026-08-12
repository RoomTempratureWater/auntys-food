const { prisma } = require('./index');
const bcrypt = require('bcryptjs');

async function main() {
  const adminUsername = 'admin';
  const adminPassword = 'password';
  
  // Check if admin already exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log('Admin user created successfully. Username: admin | Password: password');
  } else {
    console.log('Admin user already exists.');
  }

  // Create mock users
  const usersData = [
    {
      phone_number: '+91 9876543210',
      name: 'Priya Sharma',
      diet_type: 'veg',
      address: 'Flat 12B, Sunrise Apartments, MG Road',
      has_preferences: false,
      meal_balance: 18,
      is_active: true,
    },
    {
      phone_number: '+91 9876543211',
      name: 'Rahul Verma',
      diet_type: 'veg',
      address: '45, Green Valley Colony, Sector 22',
      has_preferences: true,
      preferences_text: 'Pure Veg, No Onion/Garlic',
      meal_balance: 7,
      is_active: true,
    },
    {
      phone_number: '+91 9876543212',
      name: 'Anita Desai',
      diet_type: 'nonveg',
      address: '789 Lake View Road, Near City Mall',
      has_preferences: false,
      meal_balance: 0,
      is_active: false,
    },
    {
      phone_number: '+91 9876543213',
      name: 'Mohammed Khan',
      diet_type: 'nonveg',
      address: '321 Park Street, Floor 3, Jubilee Hills',
      has_preferences: true,
      preferences_text: 'Halal, Less Spicy',
      meal_balance: 22,
      is_active: true,
    },
    {
      phone_number: '+91 9876543214',
      name: 'Sneha Patel',
      diet_type: 'veg',
      address: '67A, Diamond Plaza, Ring Road',
      has_preferences: true,
      preferences_text: 'Jain food, No root vegetables',
      meal_balance: 14,
      is_active: true,
    },
    {
      phone_number: '+91 9876543215',
      name: 'Vikram Singh',
      diet_type: 'egg',
      address: '12, Royal Enclave, Banjara Hills',
      has_preferences: false,
      meal_balance: 3,
      is_active: true,
    },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const existing = await prisma.user.findUnique({ where: { phone_number: u.phone_number } });
    if (!existing) {
      const created = await prisma.user.create({ data: u });
      createdUsers.push({ ...u, id: created.id });
    } else {
      createdUsers.push({ ...u, id: existing.id });
    }
  }
  console.log(`Created/found ${createdUsers.length} users.`);

  // Create balance transactions for each user
  for (const u of createdUsers) {
    const existingTx = await prisma.balanceTransaction.findFirst({ where: { user_id: u.id } });
    if (!existingTx && u.meal_balance > 0) {
      await prisma.balanceTransaction.create({
        data: {
          user_id: u.id,
          amount: 26,
          reason: 'Monthly recharge - August',
        },
      });
      // If current balance is less than 26, add a deduction
      if (u.meal_balance < 26) {
        await prisma.balanceTransaction.create({
          data: {
            user_id: u.id,
            amount: -(26 - u.meal_balance),
            reason: 'Meals consumed',
          },
        });
      }
    }
  }
  console.log('Balance transactions created.');

  // Generate booking data for the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  // Check if bookings already exist
  const existingBookings = await prisma.mealSchedule.count();
  if (existingBookings > 0) {
    console.log('Bookings already exist, skipping...');
  } else {
    const bookings = [];

    // Generate bookings from day 1 to today for the current month
    for (let day = 1; day <= Math.min(today, 28); day++) {
      const date = new Date(Date.UTC(year, month, day));

      // Skip Sundays (day of week = 0)
      const dayOfWeek = date.getUTCDay();
      if (dayOfWeek === 0) continue;

      for (const u of createdUsers) {
        // Skip inactive users
        if (!u.is_active) continue;

        // Each active user has a high chance of lunch, moderate chance of dinner
        const hasLunch = Math.random() < 0.85;
        const hasDinner = Math.random() < 0.45;

        if (hasLunch) {
          bookings.push({
            user_id: u.id,
            date: date,
            type: 'lunch',
            status: 'booked',
          });
        }

        if (hasDinner) {
          bookings.push({
            user_id: u.id,
            date: date,
            type: 'dinner',
            status: 'booked',
          });
        }
      }
    }

    // Also add some future bookings (next 5 days)
    for (let offset = 1; offset <= 5; offset++) {
      const futureDay = today + offset;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      if (futureDay > daysInMonth) break;

      const date = new Date(Date.UTC(year, month, futureDay));
      const dayOfWeek = date.getUTCDay();
      if (dayOfWeek === 0) continue;

      for (const u of createdUsers) {
        if (!u.is_active) continue;

        const hasLunch = Math.random() < 0.80;
        const hasDinner = Math.random() < 0.35;

        if (hasLunch) {
          bookings.push({
            user_id: u.id,
            date: date,
            type: 'lunch',
            status: 'booked',
          });
        }

        if (hasDinner) {
          bookings.push({
            user_id: u.id,
            date: date,
            type: 'dinner',
            status: 'booked',
          });
        }
      }
    }

    if (bookings.length > 0) {
      await prisma.mealSchedule.createMany({ data: bookings });
    }
    console.log(`Created ${bookings.length} meal bookings for the month.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
