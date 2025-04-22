import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Register new user
export async function POST(request: Request) {
  try {
    console.log('Registration attempt received');
    
    const { email, password } = await request.json();
    console.log('Registration data:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('Checking if user exists');
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log('User exists:', !!existingUser);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    console.log('Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = uuidv4();
    console.log('Generated user ID:', userId);

    // Insert new user
    console.log('Inserting new user into database');
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
    });
    console.log('User successfully inserted into database');

    // Generate JWT token
    console.log('Generating JWT token');
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId, role: 'user' },
      secretKey,
      { expiresIn: '1d' }
    );

    console.log('Registration successful, returning user data and token');
    return NextResponse.json({
      user: {
        id: userId,
        email,
        createdAt: new Date().toISOString(),
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 