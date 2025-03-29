import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/future-vision - Get all future visions for the current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Prepare filter conditions
    const whereClause: any = { userId };
    if (categoryId) whereClause.categoryId = categoryId;
    if (year) whereClause.year = year;
    
    const visions = await prisma.futureVision.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: [
        { year: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    return NextResponse.json(visions);
  } catch (error) {
    console.error('Error fetching future visions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch future visions' },
      { status: 500 }
    );
  }
}

// POST /api/future-vision - Create a new future vision
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, year, categoryId } = body;
    
    // Validation
    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }
    
    if (!year) {
      return NextResponse.json(
        { error: 'Year is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Check if category exists and belongs to user
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        userId,
      },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Create new future vision
    const futureVision = await prisma.futureVision.create({
      data: {
        description,
        year,
        userId,
        categoryId,
      },
    });
    
    return NextResponse.json(futureVision, { status: 201 });
  } catch (error) {
    console.error('Error creating future vision:', error);
    return NextResponse.json(
      { error: 'Failed to create future vision' },
      { status: 500 }
    );
  }
} 