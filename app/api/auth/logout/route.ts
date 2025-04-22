import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/db';
import { sessions } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';

// We don't need to modify server cookies since we're using localStorage for JWT tokens
export async function POST(request: NextRequest) {
  try {
    console.log('Logout request received');
    
    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid authorization header format');
      return NextResponse.json(
        { error: 'Invalid authorization header format' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    if (!token) {
      console.log('Empty token provided');
      return NextResponse.json(
        { error: 'Empty token provided' },
        { status: 401 }
      );
    }
    
    try {
      // Verify token to get userId
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secretKey);
      
      if (!(decoded as any).userId) {
        console.log('Token missing userId claim');
        return NextResponse.json(
          { error: 'Invalid token format: missing userId' },
          { status: 401 }
        );
      }
      
      const userId = (decoded as any).userId;
      console.log('Token verified, logging out user:', userId);
      
      // Delete user's sessions from database
      const result = await db.delete(sessions)
        .where(eq(sessions.userId, userId))
        .returning({ id: sessions.id });
      
      console.log(`Deleted ${result.length} sessions for user:`, userId);
      
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
        sessionsRemoved: result.length
      });
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Return error without revealing too much information
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 