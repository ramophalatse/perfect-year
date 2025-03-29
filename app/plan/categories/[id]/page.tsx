'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Local type definitions
type Category = {
  id: string;
  name: string;
  description: string | null;
  isPreset: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  futureVisions: FutureVision[];
  goals: Goal[];
};

type FutureVision = {
  id: string;
  description: string;
  year: number;
  yearEndReflection: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string;
};

type Goal = {
  id: string;
  title: string;
  description: string | null;
  criteria: any | null;
  targetValue: number | null;
  currentValue: number | null;
  timeframe: string;
  startDate: Date;
  endDate: Date | null;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categoryId: string | null;
  parentId: string | null;
  subgoals: Goal[];
};

export default function CategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeVisionYear, setActiveVisionYear] = useState<number | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCategory(data);
          
          // Set the most recent vision year as active
          if (data.futureVisions?.length > 0) {
            const sortedVisions = [...data.futureVisions].sort((a, b) => b.year - a.year);
            setActiveVisionYear(sortedVisions[0].year);
          }
        } else {
          console.error('Failed to fetch category');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);
  
  const toggleGoalExpand = (goalId: string) => {
    setExpandedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId) 
        : [...prev, goalId]
    );
  };
  
  const getGoalProgress = (goal: Goal): number => {
    if (goal.targetValue && goal.currentValue) {
      return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
    }
    
    // If there are subgoals, calculate progress based on completed subgoals
    if (goal.subgoals && goal.subgoals.length > 0) {
      const completed = goal.subgoals.filter(g => g.status === 'COMPLETED').length;
      return (completed / goal.subgoals.length) * 100;
    }
    
    // Default based on status
    switch (goal.status) {
      case 'COMPLETED': return 100;
      case 'IN_PROGRESS': return 50;
      case 'TODO': return 0;
      case 'CANCELED': return 0;
      default: return 0;
    }
  };
  
  const renderGoalCard = (goal: Goal, level = 0) => {
    const progress = getGoalProgress(goal);
    const isExpanded = expandedGoals.includes(goal.id);
    const hasSubgoals = goal.subgoals && goal.subgoals.length > 0;
    
    return (
      <div key={goal.id} className="mb-4">
        <div 
          className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 ${
            level > 0 ? 'ml-' + (level * 4) : ''
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center">
                {hasSubgoals && (
                  <button 
                    onClick={() => toggleGoalExpand(goal.id)}
                    className="mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {goal.title}
                </h3>
              </div>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  goal.timeframe === 'ANNUAL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  goal.timeframe === 'QUARTERLY' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                  goal.timeframe === 'MONTHLY' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {goal.timeframe.charAt(0) + goal.timeframe.slice(1).toLowerCase()}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  goal.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  goal.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  goal.status === 'TODO' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {goal.status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  goal.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  goal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  goal.priority === 'LOW' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                }`}>
                  {goal.priority.charAt(0) + goal.priority.slice(1).toLowerCase()} Priority
                </span>
              </div>
            </div>
            <div className="flex space-x-1">
              <Link
                href={`/plan/goals/${goal.id}/edit`}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          {goal.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {goal.description}
            </p>
          )}
          
          <div className="mb-2">
            <div className="flex justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full dark:bg-gray-700">
              <div 
                className="h-2 bg-blue-600 rounded-full dark:bg-blue-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
            <div>
              <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
            </div>
            {goal.endDate && (
              <div>
                <span>Due: {new Date(goal.endDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {hasSubgoals && isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Subgoals:
              </div>
              {goal.subgoals.map(subgoal => renderGoalCard(subgoal, level + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  if (!category) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Category not found
              </h1>
              <Link
                href="/plan"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Plan
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href="/plan"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Plan
            </Link>
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/plan/categories/${category.id}/edit`}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </Link>
              <Link
                href={`/plan/categories/${category.id}/goals/new`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Goal
              </Link>
            </div>
          </div>
          
          {/* Future Vision Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Future Vision
                </h2>
                <Link
                  href={`/plan/categories/${category.id}/vision/new`}
                  className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors text-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Vision
                </Link>
              </div>
              
              {category.futureVisions && category.futureVisions.length > 0 ? (
                <>
                  <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
                    {category.futureVisions
                      .sort((a, b) => b.year - a.year)
                      .map(vision => (
                        <button
                          key={vision.id}
                          onClick={() => setActiveVisionYear(vision.year)}
                          className={`px-4 py-2 text-sm font-medium ${
                            activeVisionYear === vision.year
                              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                          }`}
                        >
                          {vision.year}
                        </button>
                      ))
                    }
                  </div>
                  
                  {activeVisionYear && (
                    <div>
                      {category.futureVisions
                        .filter(vision => vision.year === activeVisionYear)
                        .map(vision => (
                          <div key={vision.id}>
                            <div className="prose dark:prose-invert max-w-none mb-6">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Vision for {vision.year}
                              </h3>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {vision.description}
                              </p>
                            </div>
                            
                            {vision.yearEndReflection && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                  Year-End Reflection
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {vision.yearEndReflection}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-4 flex justify-end">
                              <Link
                                href={`/plan/vision/${vision.id}/edit`}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit Vision
                              </Link>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    You haven't defined your vision for this area yet.
                  </p>
                  <Link
                    href={`/plan/categories/${category.id}/vision/new`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your Vision
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Goals Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Goals
              </h2>
              <Link
                href={`/plan/categories/${category.id}/goals/new`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Goal
              </Link>
            </div>
            
            {category.goals && category.goals.length > 0 ? (
              <div>
                {category.goals.map(goal => renderGoalCard(goal))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven't created any goals for this area yet.
                </p>
                <Link
                  href={`/plan/categories/${category.id}/goals/new`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Goal
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
} 