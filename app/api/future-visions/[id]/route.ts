import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
    const visionId = params.id;
    
    const vision = await prisma.futureVision.findUnique({
      where: {
        id: visionId,
        userId: userId,
      },
      include: {
        category: true,
      },
    });
    
    if (!vision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(vision);
  } catch (error) {
    console.error('Error fetching future vision:', error);
    return NextResponse.json(
      { error: 'Failed to fetch future vision' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const visionId = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    // Check if the vision exists and belongs to the user
    const vision = await prisma.futureVision.findUnique({
      where: {
        id: visionId,
        userId: userId,
      },
    });
    
    if (!vision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    // If year is changing, check for conflicts
    if (data.year && data.year !== vision.year) {
      const existingVision = await prisma.futureVision.findFirst({
        where: {
          categoryId: vision.categoryId,
          year: data.year,
          userId: userId,
          id: { not: visionId }, // Exclude the current vision
        },
      });
      
      if (existingVision) {
        return NextResponse.json(
          { error: `A vision for ${data.year} already exists for this category` },
          { status: 409 }
        );
      }
    }
    
    // Update the vision
    const updatedVision = await prisma.futureVision.update({
      where: {
        id: visionId,
      },
      data: {
        description: data.description,
        year: data.year || vision.year,
        yearEndReflection: data.yearEndReflection,
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
    const visionId = params.id;
    
    // Verify the vision exists and belongs to the user
    const vision = await prisma.futureVision.findUnique({
      where: {
        id: visionId,
        userId: userId,
      },
    });
    
    if (!vision) {
      return NextResponse.json(
        { error: 'Future vision not found' },
        { status: 404 }
      );
    }
    
    // Delete the vision
    await prisma.futureVision.delete({
      where: {
        id: visionId,
      },
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