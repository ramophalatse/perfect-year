'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Category = {
  id: string;
  name: string;
  goals: Goal[];
};

type Goal = {
  id: string;
  title: string;
  parentId: string | null;
};

export default function NewGoalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: categoryId } = params;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('QUARTERLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [parentId, setParentId] = useState('');
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [hasMetric, setHasMetric] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        if (res.ok) {
          const data = await res.json();
          setCategory(data);
          
          // Set default dates
          const today = new Date();
          setStartDate(today.toISOString().split('T')[0]);
          
          // Set default end date based on timeframe
          const endDateValue = new Date(today);
          if (timeframe === 'ANNUAL') {
            endDateValue.setFullYear(endDateValue.getFullYear() + 1);
          } else if (timeframe === 'QUARTERLY') {
            endDateValue.setMonth(endDateValue.getMonth() + 3);
          } else if (timeframe === 'MONTHLY') {
            endDateValue.setMonth(endDateValue.getMonth() + 1);
          } else { // WEEKLY
            endDateValue.setDate(endDateValue.getDate() + 7);
          }
          setEndDate(endDateValue.toISOString().split('T')[0]);
        } else {
          setError('Failed to fetch category');
        }
      } catch (error) {
        setError('Error fetching category');
        console.error('Error fetching category:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);
  
  // Update end date when timeframe changes
  useEffect(() => {
    if (startDate) {
      const startDateValue = new Date(startDate);
      const endDateValue = new Date(startDate);
      
      if (timeframe === 'ANNUAL') {
        endDateValue.setFullYear(endDateValue.getFullYear() + 1);
      } else if (timeframe === 'QUARTERLY') {
        endDateValue.setMonth(endDateValue.getMonth() + 3);
      } else if (timeframe === 'MONTHLY') {
        endDateValue.setMonth(endDateValue.getMonth() + 1);
      } else { // WEEKLY
        endDateValue.setDate(endDateValue.getDate() + 7);
      }
      
      setEndDate(endDateValue.toISOString().split('T')[0]);
    }
  }, [timeframe, startDate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Goal title is required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const goalData: any = {
        title,
        description: description || null,
        timeframe,
        startDate,
        endDate,
        priority,
        categoryId,
        parentId: parentId || null,
        status: 'TODO',
      };
      
      if (hasMetric) {
        goalData.targetValue = targetValue;
        goalData.currentValue = currentValue || 0;
      }
      
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (res.ok) {
        router.push(`/plan/categories/${categoryId}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create goal');
      }
    } catch (error) {
      setError('Error creating goal');
      console.error('Error creating goal:', error);
    } finally {
      setIsSaving(false);
    }
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
              href={`/plan/categories/${categoryId}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {category.name}
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create New Goal
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add a new goal to {category.name}
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="timeframe"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Timeframe *
                    </label>
                    <select
                      id="timeframe"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="ANNUAL">Annual</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Priority *
                    </label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Target Completion Date *
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                {category.goals && category.goals.length > 0 && (
                  <div className="mb-4">
                    <label
                      htmlFor="parentId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Parent Goal (Optional)
                    </label>
                    <select
                      id="parentId"
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">None (Top-level goal)</option>
                      {category.goals.map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.title}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Make this a subgoal of an existing goal
                    </p>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="hasMetric"
                      checked={hasMetric}
                      onChange={(e) => setHasMetric(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="hasMetric"
                      className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Add numerical metric to track progress
                    </label>
                  </div>
                  
                  {hasMetric && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pl-6">
                      <div>
                        <label
                          htmlFor="targetValue"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Target Value *
                        </label>
                        <input
                          type="number"
                          id="targetValue"
                          value={targetValue === null ? '' : targetValue}
                          onChange={(e) => setTargetValue(e.target.value ? Number(e.target.value) : null)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required={hasMetric}
                        />
                      </div>
                      
                      <div>
                        <label
                          htmlFor="currentValue"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Current Value
                        </label>
                        <input
                          type="number"
                          id="currentValue"
                          value={currentValue === null ? '' : currentValue}
                          onChange={(e) => setCurrentValue(e.target.value ? Number(e.target.value) : null)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Creating...' : 'Create Goal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 