'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from './Card';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  priority: string;
  tasks: Task[];
  projects: Project[];
}

export default function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch('/api/goals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        const data = await response.json();
        setGoals(data);
      } catch (err) {
        setError('Error loading goals. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-4">Loading goals...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (goals.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="mb-4">You don't have any goals yet.</p>
        <Link 
          href="/goals/new" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create your first goal
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Goals</h2>
        <Link 
          href="/goals/new" 
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
        >
          Add Goal
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <Link key={goal.id} href={`/goals/${goal.id}`}>
            <Card className="h-full hover:shadow-md transition">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{goal.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    goal.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    goal.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {goal.description.length > 100 
                    ? `${goal.description.substring(0, 100)}...` 
                    : goal.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{goal.tasks.length} Tasks</span>
                  <span>{goal.projects.length} Projects</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 