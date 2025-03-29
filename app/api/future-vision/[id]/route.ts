import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/future-vision/[id] - Get a specific future vision
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    const futureVision = await prisma.futureVision.findUnique({
      where: {
        id,
        userId, // Ensure the vision belongs to the user
      },
      include: {
        category: true,
      },
    });
    
    if (!futureVision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(futureVision);
  } catch (error) {
    console.error('Error fetching future vision:', error);
    return NextResponse.json(
      { error: 'Failed to fetch future vision' },
      { status: 500 }
    );
  }
}

// PUT /api/future-vision/[id] - Update a future vision
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { description, yearEndReflection } = body;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Ensure vision exists and belongs to user
    const existingVision = await prisma.futureVision.findUnique({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingVision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    // Update the vision
    const updatedVision = await prisma.futureVision.update({
      where: { id },
      data: {
        description,
        yearEndReflection,
      },
    });
    
    return NextResponse.json(updatedVision);
  } catch (error) {
    console.error('Error updating future vision:', error);
    return NextResponse.json(
      { error: 'Failed to update future vision' },
      { status: 500 }
    );
  }
}

// DELETE /api/future-vision/[id] - Delete a future vision
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Ensure vision exists and belongs to user
    const existingVision = await prisma.futureVision.findUnique({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingVision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    // Delete the vision
    await prisma.futureVision.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Future vision deleted successfully' });
  } catch (error) {
    console.error('Error deleting future vision:', error);
    return NextResponse.json(
      { error: 'Failed to delete future vision' },
      { status: 500 }
    );
  }
} 