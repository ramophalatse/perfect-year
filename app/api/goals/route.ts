import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/goals - Get all goals for the current user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const categoryId = searchParams.get('categoryId');
    const timeframe = searchParams.get('timeframe');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    // Build query based on filters
    const query: any = {
      userId: userId,
    };
    
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    if (timeframe) {
      query.timeframe = timeframe;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    // Only fetch top-level goals (no parent)
    const goals = await prisma.goal.findMany({
      where: {
        ...query,
        parentId: null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        subgoals: {
          include: {
            subgoals: true,
          },
        },
      },
      orderBy: [
        {
          priority: 'asc', // HIGH first
        },
        {
          startDate: 'asc',
        },
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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.timeframe || !data.startDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;
    
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start date' },
        { status: 400 }
      );
    }
    
    if (endDate && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid end date' },
        { status: 400 }
      );
    }
    
    if (endDate && endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }
    
    // Validate category exists and belongs to user if categoryId is provided
    if (data.categoryId) {
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
    
    // Validate parent goal exists and belongs to user if parentId is provided
    if (data.parentId) {
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
    
    // Create the goal
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        timeframe: data.timeframe,
        startDate: startDate,
        endDate: endDate,
        status: data.status || 'TODO',
        priority: data.priority || 'MEDIUM',
        targetValue: data.targetValue || null,
        currentValue: data.currentValue || null,
        userId: userId,
        categoryId: data.categoryId || null,
        parentId: data.parentId || null,
      },
    });
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
} 