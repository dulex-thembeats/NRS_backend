const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'vapttest_run2@example.com' } });
  if (!user) { console.log('User not found'); return; }
  
  const token = jwt.sign(
    { sub: user.id, type: 'password-reset', hash: user.password.substring(0, 10) },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  console.log(token);
  await prisma.$disconnect();
}
run();
