import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.description || !data.year || !data.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate year is in appropriate range
    const currentYear = new Date().getFullYear();
    if (data.year < currentYear || data.year > currentYear + 10) {
      return NextResponse.json(
        { error: 'Year must be between current year and 10 years in the future' },
        { status: 400 }
      );
    }
    
    // Verify the category exists and belongs to the user
    const category = await prisma.category.findUnique({
      where: {
        id: data.categoryId,
        userId: userId,
      },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if a vision for this year and category already exists
    const existingVision = await prisma.futureVision.findFirst({
      where: {
        categoryId: data.categoryId,
        year: data.year,
        userId: userId,
      },
    });
    
    if (existingVision) {
      return NextResponse.json(
        { error: `A vision for ${data.year} already exists for this category` },
        { status: 409 }
      );
    }
    
    // Create the future vision
    const futureVision = await prisma.futureVision.create({
      data: {
        description: data.description,
        year: data.year,
        yearEndReflection: null,
        userId: userId,
        categoryId: data.categoryId,
      },
    });
    
    return NextResponse.json(futureVision);
  } catch (error) {
    console.error('Error creating future vision:', error);
    return NextResponse.json(
      { error: 'Failed to create future vision' },
      { status: 500 }
    );
  }
} 