import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a simple test endpoint to check if our API is working
    return NextResponse.json({
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 