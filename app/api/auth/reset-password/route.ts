import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user exists, generate a reset token
    if (user) {
      // Generate a token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Set expiration (1 hour from now)
      const resetTokenExpires = new Date(Date.now() + 3600000);
      
      // Store token in the database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires,
        },
      });
      
      // In a real app, you would now send an email with a reset link
      // The link would contain the token: `/reset-password/${resetToken}`
      console.log(`Reset link would be: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`);
    }

    // Whether user exists or not, we return success for security reasons
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

// Add an endpoint to verify a token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }
    
    // Check if token exists and is valid
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { valid: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { valid: true, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return NextResponse.json(
      { error: 'Failed to verify reset token' },
      { status: 500 }
    );
  }
} 