'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Goal = {
  id: string;
  title: string;
  description: string | null;
  timeframe: string;
  startDate: string;
  endDate: string | null;
  status: string;
  priority: string;
  targetValue: number | null;
  currentValue: number | null;
  categoryId: string | null;
  parentId: string | null;
  category: {
    id: string;
    name: string;
  } | null;
  parent: {
    id: string;
    title: string;
  } | null;
};

export default function EditGoalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: goalId } = params;
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('QUARTERLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('TODO');
  const [priority, setPriority] = useState('MEDIUM');
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [hasMetric, setHasMetric] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await fetch(`/api/goals/${goalId}`);
        if (res.ok) {
          const data = await res.json();
          setGoal(data);
          
          // Format dates
          const startDateObj = new Date(data.startDate);
          const formattedStartDate = startDateObj.toISOString().split('T')[0];
          
          let formattedEndDate = '';
          if (data.endDate) {
            const endDateObj = new Date(data.endDate);
            formattedEndDate = endDateObj.toISOString().split('T')[0];
          }
          
          // Set form state
          setTitle(data.title);
          setDescription(data.description || '');
          setTimeframe(data.timeframe);
          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setStatus(data.status);
          setPriority(data.priority);
          
          // Handle numeric metrics
          if (data.targetValue !== null) {
            setTargetValue(data.targetValue);
            setCurrentValue(data.currentValue || 0);
            setHasMetric(true);
          }
        } else {
          setError('Failed to fetch goal');
        }
      } catch (error) {
        setError('Error fetching goal');
        console.error('Error fetching goal:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoal();
  }, [goalId]);
  
  // Update end date when timeframe changes
  useEffect(() => {
    if (startDate && timeframe !== goal?.timeframe) {
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
  }, [timeframe, startDate, goal]);
  
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
        endDate: endDate || null,
        status,
        priority,
      };
      
      if (hasMetric) {
        goalData.targetValue = targetValue;
        goalData.currentValue = currentValue || 0;
      } else {
        goalData.targetValue = null;
        goalData.currentValue = null;
      }
      
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      if (res.ok) {
        if (goal?.categoryId) {
          router.push(`/plan/categories/${goal.categoryId}`);
        } else {
          router.push('/plan');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update goal');
      }
    } catch (error) {
      setError('Error updating goal');
      console.error('Error updating goal:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal? This will also delete all subgoals.')) {
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        if (goal?.categoryId) {
          router.push(`/plan/categories/${goal.categoryId}`);
        } else {
          router.push('/plan');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete goal');
      }
    } catch (error) {
      setError('Error deleting goal');
      console.error('Error deleting goal:', error);
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
  
  if (!goal) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Goal not found
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
              href={goal.categoryId ? `/plan/categories/${goal.categoryId}` : '/plan'}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {goal.category ? goal.category.name : 'Plan'}
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Goal
              </h1>
              {goal.parent && (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Subgoal of: {goal.parent.title}
                </p>
              )}
              
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
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                      Track progress with numerical metric
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
                
                <div className="flex justify-between">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Goal
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