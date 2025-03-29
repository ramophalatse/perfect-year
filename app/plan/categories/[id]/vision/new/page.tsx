'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Category = {
  id: string;
  name: string;
};

export default function NewFutureVisionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: categoryId } = params;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [description, setDescription] = useState('');
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Vision description is required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch('/api/future-visions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          year,
          categoryId,
        }),
      });
      
      if (res.ok) {
        router.push(`/plan/categories/${categoryId}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create future vision');
      }
    } catch (error) {
      setError('Error creating future vision');
      console.error('Error creating future vision:', error);
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
                Create Future Vision
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Describe your vision for {category.name} in the year {year}
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Vision Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    placeholder="Imagine it's December 31st of the selected year. Looking back at this area of your life, what would make you feel fulfilled? Be specific and descriptive."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Write in present tense as if it's already happened. Be specific and vivid.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Creating...' : 'Create Vision'}
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