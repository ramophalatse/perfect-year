import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/categories/[id] - Get a specific category with its future visions and goals
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const categoryId = params.id;
    
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        userId: userId,
      },
      include: {
        futureVisions: {
          orderBy: {
            year: 'desc',
          },
        },
        goals: {
          where: {
            parentId: null, // Only top-level goals
          },
          orderBy: [
            {
              priority: 'asc', // HIGH first
            },
            {
              timeframe: 'asc', // ANNUAL first  
            },
          ],
          include: {
            subgoals: {
              include: {
                subgoals: true, // Include up to 2 levels of subgoals
              },
            },
          },
        },
      },
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, priority } = body;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        priority,
      },
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const categoryId = params.id;
    
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        userId: userId,
      },
    });
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if it's a preset category
    if (category.isPreset) {
      return NextResponse.json(
        { error: 'Preset categories cannot be deleted' },
        { status: 403 }
      );
    }
    
    // Delete the category and cascade delete related entities
    await prisma.$transaction([
      // First, delete all goals in this category
      prisma.goal.deleteMany({
        where: {
          categoryId: categoryId,
        },
      }),
      // Delete all future visions in this category
      prisma.futureVision.deleteMany({
        where: {
          categoryId: categoryId,
        },
      }),
      // Finally, delete the category itself
      prisma.category.delete({
        where: {
          id: categoryId,
        },
      }),
    ]);
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 