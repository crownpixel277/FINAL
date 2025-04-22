import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';

// Helper function to extract and verify token
async function extractUserIdFromToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid authorization header format');
      return { userId: null, error: 'Invalid authorization header format' };
    }
    
    const token = authHeader.substring(7);
    if (!token) {
      return { userId: null, error: 'Empty token provided' };
    }
    
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    console.log('Verifying token with secret key length:', secretKey.length);
    
    const decoded = jwt.verify(token, secretKey);
    if (!(decoded as any).userId) {
      console.error('Token missing userId claim');
      return { userId: null, error: 'Invalid token format: missing userId' };
    }
    
    console.log('Token verified, decoded userId:', (decoded as any).userId);
    return { userId: (decoded as any).userId, error: null };
  } catch (error) {
    console.error('Token verification error:', error);
    return { 
      userId: null, 
      error: error instanceof Error ? `Token verification error: ${error.message}` : 'Unknown token error' 
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Profile fetch request received');
    
    // Get token from header and extract userId
    const authHeader = request.headers.get('authorization');
    console.log('Auth header received:', authHeader ? `${authHeader.substring(0, 15)}...` : 'null');
    
    // Get user ID from headers (set by middleware)
    let userId = request.headers.get('x-user-id');
    console.log('User ID from headers:', userId);
    
    let tokenError = null;
    
    // If no userId in headers, try to extract from token
    if (!userId && authHeader) {
      console.log('No userId in headers, extracting from token');
      const result = await extractUserIdFromToken(request);
      userId = result.userId;
      tokenError = result.error;
      console.log('User ID extracted from token:', userId);
      
      if (tokenError) {
        console.error('Token error:', tokenError);
      }
    }
    
    if (!userId) {
      console.log('No user ID found in headers or token');
      // Try to get data for a demo user if no user ID is provided
      console.log('Fetching a demo user');
      const demoUser = await db.query.users.findFirst();
      
      if (demoUser) {
        console.log('Using demo user:', demoUser.id);
        // Don't return the password
        const { password, ...userWithoutPassword } = demoUser;
        return NextResponse.json({
          ...userWithoutPassword,
          createdAt: demoUser.createdAt ? new Date(demoUser.createdAt).toISOString() : new Date().toISOString(),
          _demoUser: true,
        });
      }
      
      console.log('No demo user found, returning unauthorized');
      return NextResponse.json(
        { error: tokenError || 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Fetch user from database
    console.log('Fetching user profile from database for userId:', userId);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    console.log('User found:', !!user);
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    
    console.log('Returning user profile data for:', user.email);
    
    // Validate and format createdAt
    let createdAtISO = new Date().toISOString(); // Default to now if invalid
    if (user.createdAt instanceof Date && !isNaN(user.createdAt.getTime())) {
      createdAtISO = user.createdAt.toISOString();
    }
    
    return NextResponse.json({
      ...userWithoutPassword,
      createdAt: createdAtISO, // Use the validated and formatted date
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile update request received');
    
    // Get token from header and extract userId
    const authHeader = request.headers.get('authorization');
    console.log('Auth header received:', authHeader ? `${authHeader.substring(0, 15)}...` : 'null');
    
    // Get user ID from headers (set by middleware)
    let userId = request.headers.get('x-user-id');
    console.log('User ID from headers:', userId);
    
    let tokenError = null;
    
    // If no userId in headers, try to extract from token
    if (!userId && authHeader) {
      console.log('No userId in headers, extracting from token');
      const result = await extractUserIdFromToken(request);
      userId = result.userId;
      tokenError = result.error;
      console.log('User ID extracted from token:', userId);
      
      if (tokenError) {
        console.error('Token error:', tokenError);
      }
    }
    
    if (!userId) {
      console.log('No user ID found in headers or token');
      return NextResponse.json(
        { error: tokenError || 'Invalid token' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Update data received:', data);
    
    // Validate input
    if (!data.email) {
      console.log('Email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    console.log('Checking if user exists');
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    console.log('Updating user in database');
    await db.update(users)
      .set({ email: data.email })
      .where(eq(users.id, userId));

    // Get updated user
    console.log('Fetching updated user data');
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!updatedUser) {
      console.log('Updated user not found');
      return NextResponse.json(
        { error: 'User not found after update' },
        { status: 500 }
      );
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = updatedUser;
    
    console.log('Returning updated user profile data for:', updatedUser.email);
    
    // Validate and format createdAt for the updated user response
    let createdAtISO = new Date().toISOString(); // Default to now if invalid
    if (updatedUser.createdAt instanceof Date && !isNaN(updatedUser.createdAt.getTime())) {
      createdAtISO = updatedUser.createdAt.toISOString();
    }

    return NextResponse.json({
      ...userWithoutPassword,
      createdAt: createdAtISO, // Use the validated and formatted date
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 