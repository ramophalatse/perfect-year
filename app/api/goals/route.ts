import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/goals - Get all goals for the current user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const parentId = searchParams.get('parentId');
    const timeframe = searchParams.get('timeframe');
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // Build filter conditions
    const whereClause: any = { userId };
    if (categoryId) whereClause.categoryId = categoryId;
    
    // Handle parent-child relationship filtering
    if (parentId === 'null') {
      whereClause.parentId = null; // Top-level goals only
    } else if (parentId) {
      whereClause.parentId = parentId; // Specific parent's children
    }
    
    if (timeframe) {
      whereClause.timeframe = timeframe;
    }
    
    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: {
        category: true,
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
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
    });
    
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST /api/goals - Create a new goal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      startDate, 
      endDate,
      timeframe = 'ANNUAL',
      criteria,
      targetValue,
      currentValue = 0,
      categoryId,
      parentId,
      priority = 'MEDIUM',
      status = 'IN_PROGRESS'
    } = body;
    
    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'Goal title is required' },
        { status: 400 }
      );
    }
    
    if (!startDate) {
      return NextResponse.json(
        { error: 'Start date is required' },
        { status: 400 }
      );
    }
    
    // In a real app, you would get the user ID from the session
    const userId = 'placeholder-user-id'; // Replace with actual auth
    
    // If parentId is provided, verify parent goal exists and belongs to user
    if (parentId) {
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
    }
    
    // If categoryId is provided, verify category exists and belongs to user
    if (categoryId) {
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
    
    // Create new goal
    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
        timeframe,
        criteria,
        targetValue,
        currentValue,
        priority,
        status,
        userId,
        categoryId,
        parentId,
      },
    });
    
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
} 