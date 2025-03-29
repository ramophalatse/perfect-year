import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if the user exists (but don't tell the client)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Whether user exists or not, we return success for security reasons
    // In a real app, you would:
    // 1. Generate a password reset token
    // 2. Store it with an expiration time
    // 3. Send an email with a reset link
    
    return NextResponse.json(
      { success: true, message: 'If an account exists with this email, you will receive password reset instructions.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during password reset request:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 