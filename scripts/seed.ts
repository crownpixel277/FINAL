import { db } from '../src/db';
import { users } from '../src/db/schema';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  await db.insert(users).values({
    id: uuidv4(),
    email: 'test@example.com',
    password: hashedPassword,
  });

  console.log('Database seeded successfully');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
}); 