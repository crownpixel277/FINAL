import { db } from '../src/db';
import { users } from '../src/db/schema';

async function debugDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Check if the users table exists
    console.log('Querying users table...');
    const allUsers = await db.select().from(users);
    
    console.log(`Found ${allUsers.length} users in the database:`);
    
    // Print user details (without password)
    allUsers.forEach(user => {
      console.log({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        passwordLength: user.password?.length || 0,
      });
    });
    
    // If no users found, create a test user
    if (allUsers.length === 0) {
      console.log('No users found. You may want to run `npm run seed` to create a test user.');
    } else {
      console.log('Database is properly set up with users.');
    }
    
    console.log('Database debug complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error debugging database:', error);
    process.exit(1);
  }
}

debugDatabase(); 