'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

interface Goal {
  id: number;
  title: string;
  progress: number;
  category: string;
}

interface Task {
  id: number;
  title: string;
  done: boolean;
  dueDate: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock data
      setGoals([
        { id: 1, title: 'Learn Next.js', progress: 60, category: 'Education' },
        { id: 2, title: 'Exercise 3x per week', progress: 40, category: 'Health' },
        { id: 3, title: 'Read 12 books this year', progress: 25, category: 'Personal' },
      ]);
      setTasks([
        { id: 1, title: 'Complete Next.js tutorial', done: false, dueDate: '2023-07-15' },
        { id: 2, title: 'Go for a 30 min run', done: true, dueDate: '2023-07-10' },
        { id: 3, title: 'Read chapter 5', done: false, dueDate: '2023-07-12' },
        { id: 4, title: 'Plan next week goals', done: false, dueDate: '2023-07-16' },
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Overview */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Goals</h3>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{goals.length}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Completed Tasks</h3>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {tasks.filter(task => task.done).length}/{tasks.length}
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Average Progress</h3>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {goals.length > 0 
                        ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) 
                        : 0}%
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">Goal Progress</h3>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.title}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500" 
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">{goal.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Upcoming Tasks</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map((task) => (
                    <div key={task.id} className="py-3 flex items-start">
                      <input 
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div className="ml-3 flex-1">
                        <p className={`text-sm ${task.done ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
                  View All Tasks
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 