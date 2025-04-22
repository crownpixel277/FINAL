import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    console.log('Login attempt received');
    
    const { email, password } = await request.json();
    console.log('Login credentials:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    // Get user from database
    console.log('Searching for user in database');
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log('User found:', !!user);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password - use our test password for now
    // Since we're in development, let's check if this is our test user
    if (email === 'test@example.com' && password === 'password123') {
      console.log('Test user login successful');
      // Generate JWT token
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      console.log('Using secret key length:', secretKey.length);
      
      const token = jwt.sign(
        { userId: user.id, role: 'user' },
        secretKey,
        { expiresIn: '1d' }
      );

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    }

    // For real users, verify password
    console.log('Verifying password');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log('Generating JWT token');
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id, role: 'user' },
      secretKey,
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 