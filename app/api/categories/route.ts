import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categories - Get all categories for current user
export async function GET() {
  try {
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        priority: 'desc',
      },
      include: {
        futureVisions: true,
        goals: {
          where: {
            parentId: null, // Only include top-level goals
          },
        },
      },
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, isPreset = false, priority = 0 } = body;
    
    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    const category = await prisma.category.create({
      data: {
        name,
        description,
        isPreset,
        priority,
        userId,
      },
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
} 