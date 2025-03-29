import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/goals/[id] - Get a specific goal with its subgoals
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    const goal = await prisma.goal.findUnique({
      where: {
        id,
        userId, // Ensure the goal belongs to current user
      },
      include: {
        category: true,
        parent: {
          select: {
            id: true,
            title: true,
            categoryId: true,
            timeframe: true,
          },
        },
        subgoals: {
          include: {
            subgoals: {
              select: {
                id: true,
                title: true,
                timeframe: true,
                status: true,
              },
            },
          },
          orderBy: [
            { priority: 'desc' },
            { startDate: 'asc' },
          ],
        },
        tasks: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        projects: true,
      },
    });
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT /api/goals/[id] - Update a goal
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      title, 
      description, 
      startDate, 
      endDate,
      timeframe,
      criteria,
      targetValue,
      currentValue,
      categoryId,
      parentId,
      priority,
      status
    } = body;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Verify goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // If changing parent, verify new parent exists and belongs to user
    if (parentId && parentId !== existingGoal.parentId) {
      const parentGoal = await prisma.goal.findUnique({
        where: {
          id: parentId,
          userId,
        },
      });
      
      if (!parentGoal) {
        return NextResponse.json(
          { error: 'Parent goal not found' },
          { status: 404 }
        );
      }
      
      // Prevent circular references
      if (parentId === id) {
        return NextResponse.json(
          { error: 'A goal cannot be its own parent' },
          { status: 400 }
        );
      }
    }
    
    // If changing category, verify new category exists and belongs to user
    if (categoryId && categoryId !== existingGoal.categoryId) {
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
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (timeframe !== undefined) updateData.timeframe = timeframe;
    if (criteria !== undefined) updateData.criteria = criteria;
    if (targetValue !== undefined) updateData.targetValue = targetValue;
    if (currentValue !== undefined) updateData.currentValue = currentValue;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    
    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/goals/[id] - Delete a goal
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Verify goal exists and belongs to user
    const existingGoal = await prisma.goal.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        subgoals: true,
      },
    });
    
    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    // Delete the goal (cascades to related tasks)
    await prisma.goal.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}