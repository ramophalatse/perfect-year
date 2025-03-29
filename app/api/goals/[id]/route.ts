import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// GET /api/goals/[id] - Get a specific goal with its subgoals
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
    const goalId = params.id;
    
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: userId,
      },
      include: {
        category: true,
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        subgoals: {
          include: {
            subgoals: true,
          },
        },
      },
    });
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const goalId = params.id;
    const data = await request.json();
    
    // Validate required fields
    if (data.title !== undefined && !data.title.trim()) {
      return NextResponse.json(
        { error: 'Goal title cannot be empty' },
        { status: 400 }
      );
    }
    
    // Check if the goal exists and belongs to the user
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: userId,
      },
    });
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    // Validate dates if provided
    let startDate = goal.startDate;
    let endDate = goal.endDate;
    
    if (data.startDate) {
      startDate = new Date(data.startDate);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid start date' },
          { status: 400 }
        );
      }
    }
    
    if (data.endDate) {
      endDate = new Date(data.endDate);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid end date' },
          { status: 400 }
        );
      }
    }
    
    if (endDate && startDate && endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }
    
    // Validate parent goal if changing
    if (data.parentId && data.parentId !== goal.parentId) {
      // Prevent circular dependencies
      if (data.parentId === goalId) {
        return NextResponse.json(
          { error: 'A goal cannot be its own parent' },
          { status: 400 }
        );
      }
      
      const parentGoal = await prisma.goal.findUnique({
        where: {
          id: data.parentId,
          userId: userId,
        },
      });
      
      if (!parentGoal) {
        return NextResponse.json(
          { error: 'Parent goal not found' },
          { status: 404 }
        );
      }
      
      // If parent goal has a category, use that category
      if (parentGoal.categoryId) {
        data.categoryId = parentGoal.categoryId;
      }
    }
    
    // Validate category if changing
    if (data.categoryId && data.categoryId !== goal.categoryId) {
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
    }
    
    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        title: data.title,
        description: data.description,
        timeframe: data.timeframe,
        startDate: startDate,
        endDate: endDate,
        status: data.status,
        priority: data.priority,
        targetValue: data.targetValue,
        currentValue: data.currentValue,
        categoryId: data.categoryId,
        parentId: data.parentId,
      },
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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const goalId = params.id;
    
    // Verify the goal exists and belongs to the user
    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
        userId: userId,
      },
      include: {
        subgoals: true,
      },
    });
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    // Delete all subgoals recursively and then delete the goal itself
    await prisma.$transaction(async (tx) => {
      // Helper function to delete subgoals recursively
      const deleteSubgoals = async (parentId: string) => {
        const subgoals = await tx.goal.findMany({
          where: { parentId },
          select: { id: true },
        });
        
        for (const subgoal of subgoals) {
          await deleteSubgoals(subgoal.id);
          await tx.goal.delete({
            where: { id: subgoal.id },
          });
        }
      };
      
      await deleteSubgoals(goalId);
      
      await tx.goal.delete({
        where: { id: goalId },
      });
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