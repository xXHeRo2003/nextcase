import { db } from "../packages/database/src/index.ts";
import { users, coinBalances } from "../packages/database/src/schema/schema.ts";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function createTestUser() {
  const email = "test@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = randomUUID();

  console.log("👤 Creating test user...");

  await db.insert(users).values({
    id: userId,
    email: email,
    passwordHash: hashedPassword,
    name: "Test User",
  });

  await db.insert(coinBalances).values({
    userId: userId,
    balance: "10000.00",
  });

  console.log(`✅ Test user created!`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`💰 Balance: 10,000 Coins`);
  
  process.exit(0);
}

createTestUser().catch(console.error);
