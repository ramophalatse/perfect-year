import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration API called');
    const { name, email, password } = await request.json();
    console.log('Received registration data:', { name, email, password: '[REDACTED]' });
    
    // Validate required fields
    if (!email || !password) {
      console.log('Validation failed: missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    console.log('Checking if user already exists with email:', email);
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        console.log('User already exists with email:', email);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error('Error checking for existing user:', findError);
      return NextResponse.json(
        { error: 'Error checking for existing user: ' + (findError instanceof Error ? findError.message : 'Unknown error') },
        { status: 500 }
      );
    }
    
    // Hash password
    console.log('Hashing password');
    let hashedPassword;
    try {
      hashedPassword = await hash(password, 10);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return NextResponse.json(
        { error: 'Error hashing password: ' + (hashError instanceof Error ? hashError.message : 'Unknown error') },
        { status: 500 }
      );
    }
    
    // Create user
    console.log('Creating new user with email:', email);
    try {
      const user = await prisma.user.create({
        data: {
          name: name || '',
          email,
          password: hashedPassword,
          role: 'USER',
        },
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      console.log('User created successfully with ID:', user.id);
      return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      
      // Check for specific error types
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown error';
      
      // Check if it's a unique constraint violation (email already exists)
      if (errorMessage.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Database error: ' + errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}