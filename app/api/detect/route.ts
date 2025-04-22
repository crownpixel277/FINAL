import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/config';
import { headers } from 'next/headers';

// Mock ML model function (to be replaced with actual model)
async function mockMLModel(file: File, type: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    isDeepfake: Math.random() > 0.5,
    confidence: Math.random(),
    details: {
      manipulationType: ['face_swap', 'voice_synthesis', 'video_editing'][Math.floor(Math.random() * 3)],
      confidenceScores: {
        face: Math.random(),
        voice: Math.random(),
        video: Math.random(),
      },
    },
  };
}

export async function POST(request: Request) {
  try {
    // Get user from middleware
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    const userRole = headersList.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Missing file or type' },
        { status: 400 }
      );
    }

    // Check user credits
    const userResult = await pool.query(
      'SELECT credits FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows[0].credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Create detection record
    const detectionResult = await pool.query(
      `INSERT INTO detections 
       (user_id, type, status, file_url, original_filename, file_size, mime_type) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id`,
      [
        userId,
        type,
        'processing',
        'pending', // Will be updated with actual file URL
        file.name,
        file.size,
        file.type,
      ]
    );

    const detectionId = detectionResult.rows[0].id;

    // Process with mock ML model
    const result = await mockMLModel(file, type);

    // Update detection with results
    await pool.query(
      `UPDATE detections 
       SET status = 'completed', 
           result = $1, 
           confidence_score = $2,
           processing_time = 2000
       WHERE id = $3`,
      [result, result.confidence, detectionId]
    );

    // Deduct credits
    await pool.query(
      'UPDATE users SET credits = credits - 1 WHERE id = $1',
      [userId]
    );

    // Create usage record
    await pool.query(
      `INSERT INTO usage_statistics 
       (user_id, detection_type, credits_used, processing_time, success) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, type, 1, 2000, true]
    );

    return NextResponse.json({
      detectionId,
      result,
    });
  } catch (error) {
    console.error('Detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 