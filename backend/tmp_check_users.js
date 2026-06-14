require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log(JSON.stringify(users, null, 2));
  } catch (e) { console.error(e); }
  process.exit(0);
}

check();
